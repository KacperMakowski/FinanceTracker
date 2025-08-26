# Personal Finance Tracker

A web-based personal finance tracking application built with Flask and Chart.js that helps you visualize and manage your financial data through an intuitive dashboard.

## Features

- 📊 **Interactive Dashboard**: Visualize your financial data with multiple interactive charts
- 📈 **Transaction Tracking**: Import and track your banking transactions
- 🏷️ **Category Management**: Organize transactions with customizable categories
- 📁 **CSV Import**: Easy data import from bank statements
- 📱 **Responsive Design**: Fully responsive interface that works on all devices
- 📊 **Multiple Chart Types**: Including line charts for income/expenses and doughnut charts for category distribution

## Technology Stack

- **Backend**: Python/Flask
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Database**: SQLite
- **Charts**: Chart.js
- **Icons**: Font Awesome

## Setup

1. Clone the repository
```bash
git clone https://github.com/KacperMakowski/FinanceTracker
```
2. Install required Python packages
```bash
pip install -r requirements.txt
```
4. Run the application
```bash
python run.py
```
## Usage

### Importing Transactions

2. Click the "Choose file" button on the dashboard
3. Select transactions.csv
4. Click "Save" to import the transactions
Thought for 5 seconds```markdown

### Managing Categories

1. Navigate to "Add categories for users" to create new categories
2. Use "Edit user categories" to modify existing categories
3. Categories will be automatically applied to transactions


### Viewing Analytics

The dashboard provides several visualizations:

- Income vs Expenses over time
- Monthly balance trends
- Category-wise expense distribution
- Period-specific category analysis

## Database Structure

The application uses SQLite with two main tables:

- `data`: Stores transaction records
- `categorised_users`: Stores user category mappings


## Contributing

Feel free to submit issues and enhancement requests!

## License

[MIT License](LICENSE)
