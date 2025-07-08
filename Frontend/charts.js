// charts.js

let pieChart;
let barChart;

// Update Charts
function updateCharts(expenses) {
    const categoryTotals = {};
    const dailyTotals = {};

    expenses.forEach(expense => {
        const { category, amount, date } = expense;
        const numericAmount = parseFloat(amount); // Always ensure number

        // Category-wise total for pie chart
        if (categoryTotals[category]) {
            categoryTotals[category] += numericAmount;
        } else {
            categoryTotals[category] = numericAmount;
        }

        // Date-wise total for bar chart
        // ⚡ DO NOT parse date using new Date(date)
        const formattedDate = date; // Use date as plain string 'YYYY-MM-DD'
        if (dailyTotals[formattedDate]) {
            dailyTotals[formattedDate] += numericAmount;
        } else {
            dailyTotals[formattedDate] = numericAmount;
        }
    });

    // SORT dailyTotals by date
    const sortedDates = Object.keys(dailyTotals).sort((a, b) => a.localeCompare(b));
    const sortedAmounts = sortedDates.map(date => dailyTotals[date]);

    // Format dates like "Apr 26" instead of "2025-04-26"
    const prettyDates = sortedDates.map(dateStr => {
        const [year, month, day] = dateStr.split('-');
        const dateObj = new Date(`${month}/${day}/${year}`);
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Destroy previous charts if they exist
    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    const pieCtx = document.getElementById('pie-chart').getContext('2d');
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: generateColors(Object.keys(categoryTotals).length),
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    const barCtx = document.getElementById('bar-chart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: prettyDates,
            datasets: [{
                label: 'Expenses ($)',
                data: sortedAmounts,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: false
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)',
                    }
                }
            }
        },
    });
}

// Generate random colors for pie chart
function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`hsl(${i * (360 / count)}, 70%, 60%)`);
    }
    return colors;
}
