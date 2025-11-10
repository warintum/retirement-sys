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

// Initialize the app
function init() {
    // Set default values
    workStartYearInput.value = workStartYear;
    currentAgeInput.value = currentAge;
    currentSalaryInput.value = currentSalary;
    bonusRateInput.value = bonusRate;
    salaryIncreaseRateInput.value = salaryIncreaseRate;
    providentFundRateInput.value = providentFundRate;
    existingProvidentFundInput.value = existingProvidentFund;
    
    // Add event listeners
    calculateButton.addEventListener('click', calculateRetirement);
    
    // Add input event listeners for real-time updates
    workStartYearInput.addEventListener('input', updateValue);
    currentAgeInput.addEventListener('input', updateValue);
    currentSalaryInput.addEventListener('input', updateValue);
    bonusRateInput.addEventListener('input', updateValue);
    salaryIncreaseRateInput.addEventListener('input', updateValue);
    providentFundRateInput.addEventListener('input', updateValue);
    existingProvidentFundInput.addEventListener('input', updateValue);
    
    // Calculate with default values
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