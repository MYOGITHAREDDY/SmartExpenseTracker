let currentExpenses = []; // Store the currently displayed expenses

function loadExpenses(month = '', year = '') {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        console.error('User email not found in localStorage.');
        return;
    }

    let apiUrl = `https://sep76b9xq3.execute-api.us-east-1.amazonaws.com/prod/expenses?userEmail=${encodeURIComponent(userEmail)}`;

    if (month) {
        apiUrl += `&month=${month}`;
    }
    if (year) {
        apiUrl += `&year=${year}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(expenses => {
            console.log('Expenses loaded:', expenses);
            currentExpenses = expenses; // Store the fetched expenses
            const filteredExpenses = filterExpensesByMonthYear(expenses, month, year);
            displayExpenses(filteredExpenses);
            updateCharts(filteredExpenses);
            updateTotalExpenses(filteredExpenses); // Update total for the current view
        })
        .catch(error => {
            console.error('Error loading expenses:', error);
        });
}

function filterExpensesByMonthYear(expenses, month, year) {
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = (expenseDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const expenseYear = expenseDate.getFullYear().toString();

        const monthMatch = !month || expenseMonth === month;
        const yearMatch = !year || expenseYear === year;

        return monthMatch && yearMatch;
    });
}

function displayExpenses(expenses) {
    const tableBody = document.getElementById('expensesTableBody');
    tableBody.innerHTML = '';

    expenses.forEach(expense => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.description}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense('${expense.timestamp}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function deleteExpense(timestamp) {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        console.error('User email not found in localStorage.');
        return;
    }

    fetch(`https://sep76b9xq3.execute-api.us-east-1.amazonaws.com/prod/expenses`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userEmail: userEmail,
            timestamp: timestamp
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Expense deleted successfully.');
        loadExpenses(document.getElementById('monthFilter').value, document.getElementById('yearFilter').value); // Reload with current filter
    })
    .catch(error => {
        console.error('Error deleting expense:', error);
    });
}

function updateTotalExpenses(expenses) {
    let total = 0;
    expenses.forEach(expense => {
        total += parseFloat(expense.amount);
    });
    const totalExpensesElement = document.getElementById('total-expenses');
    totalExpensesElement.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('userEmail')) {
        console.error('User email missing, redirecting to login.');
        window.location.href = 'index.html';
        return;
    }

    loadExpenses(); // Load all expenses initially

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });

    const monthFilter = document.getElementById('monthFilter');
    const yearFilter = document.getElementById('yearFilter');
    const applyFilterBtn = document.getElementById('applyFilter');

    applyFilterBtn.addEventListener('click', function() {
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;
        loadExpenses(selectedMonth, selectedYear);
    });

    document.getElementById('expenseForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userEmail = localStorage.getItem('userEmail');
        const description = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;

        if (!userEmail || !description || isNaN(amount) || !date || !category) {
            alert('Please fill in all fields.');
            return;
        }

        const expenseData = {
            userEmail: userEmail,
            description: description,
            amount: amount,
            date: date,
            category: category
        };

        fetch('https://sep76b9xq3.execute-api.us-east-1.amazonaws.com/prod/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add expense.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Expense added:', data);
            document.getElementById('expenseForm').reset();
            loadExpenses(monthFilter.value, yearFilter.value); // Reload with current filter
        })
        .catch(error => {
            console.error('Error adding expense:', error);
        });
    });
});