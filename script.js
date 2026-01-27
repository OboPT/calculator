/* script.js */
let myChart;

function calculate() {
    // 1. Deteção automática de idioma e configuração de moeda
    const lang = document.documentElement.lang || 'pt';
    const locales = { 'pt': 'pt-PT', 'es': 'es-ES', 'en': 'en-GB' };
    const currentLocale = locales[lang] || 'pt-PT';
    
    // 2. Captura de Inputs
    const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
    const startAge = parseInt(document.getElementById('currentAge').value) || 0;
    const targetAge = parseInt(document.getElementById('targetAge').value) || 0;
    const annualRate = (parseFloat(document.getElementById('annualRate').value) || 0) / 100;
    const inflationRate = (parseFloat(document.getElementById('inflationRate').value) || 0) / 100;
    
    const monthlyRate = annualRate / 12;
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    let balance = initialCapital;
    let totalInvested = initialCapital;
    let labels = []; let balanceData = []; let investedData = [];

    // 3. Loop de Cálculo (Fórmula VF Mensal)
    for (let age = startAge; age < targetAge; age++) {
        let monthlyInvestment = age;
        let yearlyInvested = monthlyInvestment * 12;
        
        let fvDeposits = monthlyInvestment * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate) * (1 + monthlyRate);
        balance = balance * Math.pow(1 + monthlyRate, 12) + fvDeposits;
        totalInvested += yearlyInvested;

        tableBody.innerHTML += `
            <tr>
                <td>${age + 1}</td>
                <td>${monthlyInvestment.toFixed(2)}</td>
                <td>${yearlyInvested.toFixed(2)}</td>
                <td>${totalInvested.toLocaleString(currentLocale)}</td>
                <td>${(balance - totalInvested).toLocaleString(currentLocale)}</td>
                <td><strong>${balance.toLocaleString(currentLocale)}</strong></td>
            </tr>`;

        labels.push(age + 1);
        balanceData.push(balance.toFixed(2));
        investedData.push(totalInvested.toFixed(2));
    }

    // 4. Resultados Finais e Inflação
    const years = targetAge - startAge;
    const realValue = balance / Math.pow(1 + inflationRate, years);

    document.getElementById('finalBalance').innerText = balance.toLocaleString(currentLocale, {style: 'currency', currency: 'EUR'});
    document.getElementById('totalInterest').innerText = (balance - totalInvested).toLocaleString(currentLocale, {style: 'currency', currency: 'EUR'});
    document.getElementById('realValue').innerText = realValue.toLocaleString(currentLocale, {style: 'currency', currency: 'EUR'});

    updateChart(labels, balanceData, investedData, lang);
}

function updateChart(labels, balanceData, investedData, lang) {
    const chartLabels = {
        'pt': { total: 'Saldo Total', inv: 'Capital Investido' },
        'es': { total: 'Saldo Total', inv: 'Inversión Acumulada' },
        'en': { total: 'Total Balance', inv: 'Total Invested' }
    }[lang];

    const ctx = document.getElementById('investmentChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: chartLabels.total, data: balanceData, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.3 },
                { label: chartLabels.inv, data: investedData, borderColor: '#94a3b8', borderDash: [5, 5], fill: false }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Inicializa o cálculo ao carregar
window.onload = calculate;
