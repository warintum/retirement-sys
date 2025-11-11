// Global variables
let workStartYear = 0;
let currentSalary = 0;
let bonusRate = 0;
let salaryIncreaseRate = 0;
let providentFundRate = 0;
let currentAge = 0;
let existingProvidentFund = 0;
const retirementAge = 60;
const currentYear = 2025;

// localStorage key
const STORAGE_KEY = 'retirement_calculator_data';

// DOM elements
const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const calculateButton = document.getElementById('calculateButton');

// Input elements
const workStartYearInput = document.getElementById('workStartYear');
const currentAgeInput = document.getElementById('currentAge');
const currentSalaryInput = document.getElementById('currentSalary');
const bonusRateInput = document.getElementById('bonusRate');
const salaryIncreaseRateInput = document.getElementById('salaryIncreaseRate');
const providentFundRateInput = document.getElementById('providentFundRate');
const existingProvidentFundInput = document.getElementById('existingProvidentFund');

// Result elements
const yearsWorkedEl = document.getElementById('yearsWorked');
const yearsUntilRetirementEl = document.getElementById('yearsUntilRetirement');
const totalWorkYearsEl = document.getElementById('totalWorkYears');
const salaryAt60El = document.getElementById('salaryAt60');
const existingFundAtRetirementEl = document.getElementById('existingFundAtRetirement');
const futureProvidentFundEl = document.getElementById('futureProvidentFund');
const providentFundDetailsEl = document.getElementById('providentFundDetails');
const retirementBenefitEl = document.getElementById('retirementBenefit');
const retirementFormulaEl = document.getElementById('retirementFormula');
const totalMoneyEl = document.getElementById('totalMoney');
const bonusByYearEl = document.getElementById('bonusByYear');
const formula1El = document.getElementById('formula1');
const formula2El = document.getElementById('formula2');
const formula1CalcEl = document.getElementById('formula1Calc');
const formula2CalcEl = document.getElementById('formula2Calc');
const formula1SelectedEl = document.getElementById('formula1Selected');
const formula2SelectedEl = document.getElementById('formula2Selected');
const summaryTotalEl = document.getElementById('summaryTotal');
const summaryRetirementEl = document.getElementById('summaryRetirement');
const summaryProvidentFundEl = document.getElementById('summaryProvidentFund');
const summaryExistingFundEl = document.getElementById('summaryExistingFund');
const summaryFutureFundEl = document.getElementById('summaryFutureFund');

// Save data to localStorage
function saveToLocalStorage() {
    const data = {
        workStartYear,
        currentAge,
        currentSalary,
        bonusRate,
        salaryIncreaseRate,
        providentFundRate,
        existingProvidentFund,
        lastSaved: new Date().toISOString()
    };
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showSaveIndicator();
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Load data from localStorage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Update variables
            workStartYear = data.workStartYear || 0;
            currentAge = data.currentAge || 0;
            currentSalary = data.currentSalary || 0;
            bonusRate = data.bonusRate || 0;
            salaryIncreaseRate = data.salaryIncreaseRate || 0;
            providentFundRate = data.providentFundRate || 0;
            existingProvidentFund = data.existingProvidentFund || 0;
            
            // Update input fields
            workStartYearInput.value = workStartYear;
            currentAgeInput.value = currentAge;
            currentSalaryInput.value = currentSalary;
            bonusRateInput.value = bonusRate;
            salaryIncreaseRateInput.value = salaryIncreaseRate;
            providentFundRateInput.value = providentFundRate;
            existingProvidentFundInput.value = existingProvidentFund;
            
            // Show last saved date if available
            if (data.lastSaved) {
                const lastSavedDate = new Date(data.lastSaved);
                const formattedDate = lastSavedDate.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                showLastSavedInfo(formattedDate);
            }
            
            return true;
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
    return false;
}

// Show save indicator
function showSaveIndicator() {
    // Remove existing indicator if any
    const existingIndicator = document.querySelector('.save-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create and show new indicator
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        บันทึกข้อมูลแล้ว
    `;
    
    // Style the indicator
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(indicator);
    
    // Remove after 2 seconds
    setTimeout(() => {
        indicator.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 300);
    }, 2000);
}

// Show last saved info
function showLastSavedInfo(dateString) {
    // Remove existing info if any
    const existingInfo = document.querySelector('.last-saved-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    // Create and show info
    const info = document.createElement('div');
    info.className = 'last-saved-info';
    info.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        โหลดข้อมูลล่าสุด: ${dateString}
    `;
    
    // Style the info
    info.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: #3b82f6;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(info);
    
    // Remove after 5 seconds
    setTimeout(() => {
        info.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (info.parentNode) {
                info.parentNode.removeChild(info);
            }
        }, 300);
    }, 5000);
}

// Clear saved data
function clearSavedData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        showSaveIndicator();
        
        // Reset to default values
        workStartYear = 0;
        currentAge = 0;
        currentSalary = 0;
        bonusRate = 0;
        salaryIncreaseRate = 0;
        providentFundRate = 0;
        existingProvidentFund = 0;
        
        // Update input fields
        workStartYearInput.value = '';
        currentAgeInput.value = '';
        currentSalaryInput.value = '';
        bonusRateInput.value = '';
        salaryIncreaseRateInput.value = '';
        providentFundRateInput.value = '';
        existingProvidentFundInput.value = '';
        
        // Recalculate with empty values
        calculateRetirement();
    } catch (e) {
        console.error('Error clearing localStorage:', e);
    }
}

// Debounce function to limit save calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced save function
const debouncedSave = debounce(saveToLocalStorage, 1000);

// Initialize the app
function init() {
    // Try to load saved data
    const hasSavedData = loadFromLocalStorage();
    
    // Add event listeners
    calculateButton.addEventListener('click', () => {
        calculateRetirement();
        saveToLocalStorage();
    });
    
    // Add input event listeners for real-time updates with debounced save
    workStartYearInput.addEventListener('input', (e) => {
        updateValue(e);
        debouncedSave();
    });
    currentAgeInput.addEventListener('input', (e) => {
        updateValue(e);
        debouncedSave();
    });
    currentSalaryInput.addEventListener('input', (e) => {
        updateValue(e);
        debouncedSave();
    });
    bonusRateInput.addEventListener('input', (e) => {
        updateValue(e);
        debouncedSave();
    });
    salaryIncreaseRateInput.addEventListener('input', (e) => {
        updateValue(e);
        debouncedSave();
    });
    providentFundRateInput.addEventListener('input', (e) => {
        updateValue(e);
        debouncedSave();
    });
    existingProvidentFundInput.addEventListener('input', (e) => {
        updateValue(e);
        debouncedSave();
    });
    
    // Calculate with loaded or default values
    calculateRetirement();
    
    // Show main content
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
    }, 500);
}

// Update value from input
function updateValue(e) {
    const value = e.target.value;
    const numValue = parseFloat(value) || 0;
    
    switch(e.target.id) {
        case 'workStartYear':
            workStartYear = numValue;
            break;
        case 'currentAge':
            currentAge = numValue;
            break;
        case 'currentSalary':
            currentSalary = numValue;
            break;
        case 'bonusRate':
            bonusRate = numValue;
            break;
        case 'salaryIncreaseRate':
            salaryIncreaseRate = numValue;
            break;
        case 'providentFundRate':
            providentFundRate = numValue;
            break;
        case 'existingProvidentFund':
            existingProvidentFund = numValue;
            break;
    }
}

// Calculate retirement data
function calculateRetirement() {
    // Get input values
    workStartYear = parseFloat(workStartYearInput.value) || 0;
    currentAge = parseFloat(currentAgeInput.value) || 0;
    currentSalary = parseFloat(currentSalaryInput.value) || 0;
    bonusRate = parseFloat(bonusRateInput.value) || 0;
    salaryIncreaseRate = parseFloat(salaryIncreaseRateInput.value) || 0;
    providentFundRate = parseFloat(providentFundRateInput.value) || 0;
    existingProvidentFund = parseFloat(existingProvidentFundInput.value) || 0;
    
    // Calculate data
    const yearsWorked = currentYear - workStartYear;
    const yearsUntilRetirement = retirementAge - currentAge;
    const totalWorkYears = yearsWorked + yearsUntilRetirement;
    const salaryIncreaseDecimal = salaryIncreaseRate / 100;
    const providentFundDecimal = providentFundRate / 100;
    const totalProvidentFundRate = providentFundDecimal * 2; // พนักงาน + นายจ้าง (เท่ากัน)
    const salaryAt60 = Math.round(currentSalary * Math.pow(1 + salaryIncreaseDecimal, yearsUntilRetirement));
    
    // Calculate bonus by year
    const bonusByYear = [];
    let tempSalary = currentSalary;
    for (let year = 0; year < yearsUntilRetirement; year++) {
        const bonus = Math.round(tempSalary * bonusRate);
        bonusByYear.push({
            year: currentYear + year,
            salary: Math.round(tempSalary),
            bonus: bonus
        });
        tempSalary *= (1 + salaryIncreaseDecimal);
    }
    
    // Calculate provident fund (future contributions only)
    let futureProvidentFund = 0;
    let currentSalaryForPF = currentSalary;
    const fundReturnRate = 0.01; // 1% per year
    
    for (let year = 0; year < yearsUntilRetirement; year++) {
        const yearlyContribution = currentSalaryForPF * 12 * totalProvidentFundRate;
        const yearsRemaining = yearsUntilRetirement - year;
        const futureValue = yearlyContribution * Math.pow(1 + fundReturnRate, yearsRemaining);
        futureProvidentFund += futureValue;
        currentSalaryForPF *= (1 + salaryIncreaseDecimal);
    }
    
    // Total provident fund (existing + future)
    const existingFundAtRetirement = existingProvidentFund;
    const totalProvidentFund = existingFundAtRetirement + futureProvidentFund;
    
    // Calculate retirement benefit
    const retirement1 = (salaryAt60 * 400) / 30;
    const retirement2 = (salaryAt60 * totalWorkYears) / 2;
    const retirementBenefit = Math.max(retirement1, retirement2);
    
    // Total money = retirement benefit + provident fund
    const totalMoney = retirementBenefit + totalProvidentFund;
    
    // Update UI
    updateUI({
        yearsWorked,
        yearsUntilRetirement,
        totalWorkYears,
        salaryAt60,
        bonusByYear,
        futureProvidentFund,
        existingFundAtRetirement,
        totalProvidentFund,
        retirement1,
        retirement2,
        retirementBenefit,
        totalMoney,
        providentFundRate
    });
}

// Update UI with calculated data
function updateUI(data) {
    const {
        yearsWorked,
        yearsUntilRetirement,
        totalWorkYears,
        salaryAt60,
        bonusByYear,
        futureProvidentFund,
        existingFundAtRetirement,
        totalProvidentFund,
        retirement1,
        retirement2,
        retirementBenefit,
        totalMoney,
        providentFundRate
    } = data;
    
    // Update basic info
    yearsWorkedEl.textContent = yearsWorked;
    yearsUntilRetirementEl.textContent = yearsUntilRetirement;
    totalWorkYearsEl.textContent = totalWorkYears;
    salaryAt60El.textContent = salaryAt60.toLocaleString();
    
    // Update stats cards
    existingFundAtRetirementEl.textContent = `${existingFundAtRetirement.toLocaleString()}฿`;
    futureProvidentFundEl.textContent = `${Math.round(futureProvidentFund).toLocaleString()}฿`;
    providentFundDetailsEl.textContent = `${providentFundRate}% + ${providentFundRate}% (นายจ้าง) + ผลตอบแทน 1%`;
    retirementBenefitEl.textContent = `${Math.round(retirementBenefit).toLocaleString()}฿`;
    retirementFormulaEl.textContent = retirement2 > retirement1 ? "ใช้สูตรที่ 2" : "ใช้สูตรที่ 1";
    totalMoneyEl.textContent = `${Math.round(totalMoney).toLocaleString()}฿`;
    
    // Update bonus by year
    bonusByYearEl.innerHTML = '';
    bonusByYear.forEach(item => {
        const bonusItem = document.createElement('div');
        bonusItem.className = 'bonus-item';
        bonusItem.innerHTML = `
            <div>
                <span class="bonus-year">ปี ${item.year}</span>
                <p class="bonus-salary">เงินเดือน ${item.salary.toLocaleString()}฿</p>
            </div>
            <div class="text-right">
                <span class="bonus-amount">${item.bonus.toLocaleString()}฿</span>
                <p class="bonus-rate">${bonusRate} เท่า</p>
            </div>
        `;
        bonusByYearEl.appendChild(bonusItem);
    });
    
    // Update formula cards
    formula1CalcEl.textContent = `${salaryAt60.toLocaleString()} × 400 ÷ 30 = ${Math.round(retirement1).toLocaleString()} ฿`;
    formula2CalcEl.textContent = `${salaryAt60.toLocaleString()} × ${totalWorkYears} ÷ 2 = ${Math.round(retirement2).toLocaleString()} ฿`;
    
    if (retirement1 >= retirement2) {
        formula1El.classList.add('active');
        formula1El.classList.remove('inactive');
        formula2El.classList.add('inactive');
        formula2El.classList.remove('active');
        formula1SelectedEl.style.display = 'block';
        formula2SelectedEl.style.display = 'none';
    } else {
        formula2El.classList.add('active');
        formula2El.classList.remove('inactive');
        formula1El.classList.add('inactive');
        formula1El.classList.remove('active');
        formula2SelectedEl.style.display = 'block';
        formula1SelectedEl.style.display = 'none';
    }
    
    // Update summary
    summaryTotalEl.textContent = `${Math.round(totalMoney).toLocaleString()} ฿`;
    summaryRetirementEl.textContent = `${Math.round(retirementBenefit).toLocaleString()} ฿`;
    summaryProvidentFundEl.textContent = `${Math.round(totalProvidentFund).toLocaleString()} ฿`;
    summaryExistingFundEl.textContent = `${existingFundAtRetirement.toLocaleString()} ฿`;
    summaryFutureFundEl.textContent = `${Math.round(futureProvidentFund).toLocaleString()} ฿`;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);