# MyWealth - Personal Wealth Tracking Application

A comprehensive personal finance and wealth tracking application inspired by FinBoom.app, built with Next.js and FastAPI.

## 🌟 Features

### Core Features
- **Net Worth Tracking**: Calculate and monitor your net worth across all assets and liabilities
- **Asset Management**: Track 20+ indian asset classes (equity, debt, gold, crypto, SIPs, PPF, NPS, etc.)
- **Liability Tracking**: Monitor loans, mortgages, and other liabilities
- **Financial Goals**: Set and track financial objectives with progress visualization
- **Income & Expense Tracking**: Log and analyze monthly income and spending
- **Asset Allocation**: View portfolio allocation breakdown and percentages
- **Financial Health Check**: Get recommendations on emergency funds, insurance, and more

### Advanced Features
- **Net Worth Snapshots**: Freeze your financial state and compare month-over-month
- **Portfolio Analysis**: Get AI-powered recommendations for rebalancing
- **Growth Tracking**: Visualize net worth growth over time
- **Multi-Asset Support**: Track investments across different asset classes
- **Data Insights**: See detailed breakdown of income, expenses, and savings rate
- **Goal Progress**: Track progress towards financial milestones

## 🏗️ Project Structure

```
mywealth/
├── app/                    # Next.js Frontend (App Router)
│   ├── page.tsx           # Main Dashboard
│   ├── goals.tsx          # Financial Goals Page
│   ├── cashflow.tsx       # Income & Expenses Page
│   └── layout.tsx         # Root Layout
├── api/                    # FastAPI Backend
│   ├── index.py           # Main API endpoints
│   └── requirements.txt    # Python dependencies
├── public/                 # Static assets
├── package.json           # Frontend dependencies
└── vercel.json           # Deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL database (Vercel Postgres or Neon)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/r-kanagasabapathi/mywealth.git
cd mywealth
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd api
pip install -r requirements.txt
cd ..
```

### Environment Setup

Create a `.env.local` file in the root directory:
```env
POSTGRES_URL=your_postgres_connection_string
```

### Running Locally

1. **Start the development server**
```bash
npm run dev
```

2. **Start the API server** (in a separate terminal)
```bash
cd api
uvicorn index:app --reload
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 API Endpoints

### Health & Setup
- `GET /api/health` - Check API status
- `GET /api/setup-db` - Initialize database tables

### Assets Management
- `POST /api/assets/add` - Add new asset
- `GET /api/assets/{user_id}` - Get all assets

### Portfolio Analysis
- `POST /api/portfolio/analyze` - Analyze portfolio and get recommendations
- `POST /api/networth/snapshot` - Create net worth snapshot
- `GET /api/portfolio/growth/{user_id}` - Get portfolio growth data

### Financial Health
- `GET /api/financial-health/{user_id}` - Check financial health metrics

### Cash Flow
- `POST /api/income/add` - Record income
- `POST /api/expenses/add` - Record expense
- `GET /api/cash-flow/{user_id}` - Get monthly cash flow analysis

### Goals
- `GET /api/goals/{user_id}` - Get all financial goals
- `POST /api/goals/add` - Create new goal

### Data Import
- `POST /api/import/csv` - Import portfolio from CSV

## 🎯 Key Features Implemented from FinBoom

✅ **Net Worth Tracking** - Calculate and visualize your complete financial picture  
✅ **Multi-Asset Support** - Support for 20+ Indian asset classes  
✅ **Income/Expense Tracking** - Log all income sources and spending  
✅ **Financial Goals** - Set and monitor progress towards financial objectives  
✅ **Asset Allocation** - Visual breakdown of portfolio allocation  
✅ **Financial Health Check** - Recommendations for emergency funds, insurance, etc.  
✅ **Growth Analysis** - Track changes in net worth over time  
✅ **Data Privacy** - No broker/bank connections, user controls their data  
✅ **Snapshots** - Freeze financial state for historical comparison  
✅ **Personalized Recommendations** - AI-driven portfolio insights  

## 💾 Data Models

### Asset
```typescript
{
  name: string
  asset_class: string  // equity, debt, gold, crypto, sip, ppf, nps, etc.
  value_inr: number
  currency: string     // ISO currency code, default: INR
  quantity?: number
  buy_price?: number
}
```

### Liability
```typescript
{
  name: string
  amount: number
  interest_rate?: number
}
```

### Income
```typescript
{
  source: string
  amount: number
  month: number
  year: number
}
```

### Expense
```typescript
{
  category: string
  amount: number
  month: number
  year: number
}
```

### Goal
```typescript
{
  name: string
  target_amount: number
  current_amount: number
  target_year: number
  priority: string  // low, medium, high
}
```

## 🔒 Privacy & Security

- **No Broker Access**: We never connect to your brokerage or bank accounts
- **Data Ownership**: Your financial data is 100% yours
- **Local Control**: All data stored securely in your PostgreSQL database
- **No Data Selling**: Your information is never sold or shared
- **Data Export**: Full ability to export all data anytime

## 🛠️ Technology Stack

### Frontend
- **Next.js** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type safety
- **Recharts** - Data visualization
- **CSS-in-JS** - Inline styling

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **PostgreSQL** - Database
- **Psycopg2** - PostgreSQL driver

### Deployment
- **Vercel** - Frontend hosting
- **Neon** - PostgreSQL database

## 📈 Supported Asset Classes

1. Equity / Stocks
2. Debt / Fixed Income
3. Gold
4. Cryptocurrency
5. SIPs (Systematic Investment Plans)
6. Mutual Funds
7. PPF (Public Provident Fund)
8. EPF (Employee Provident Fund)
9. NPS (National Pension System)
10. SSY (Sukanya Samriddhi Yojana)
11. SGBs (Sovereign Gold Bonds)
12. ULIPs (Unit Linked Insurance Plans)
13. Insurance
14. Real Estate
15. And more...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**R. Kanagasabapathi**  
GitHub: [@r-kanagasabapathi](https://github.com/r-kanagasabapathi)

## 🙏 Acknowledgments

Inspired by [FinBoom.app](https://finboom.app) - A privacy-first wealth tracking platform built for Indian investors.

## 📞 Support

For support, email support@mywealth.app or open an issue on GitHub.

## 🚀 Roadmap

- [ ] Mobile app (React Native)
- [ ] Live price updates for stocks and crypto
- [ ] CSV import from Zerodha and Groww
- [ ] Advanced visualizations and charts
- [ ] Family profiles and multi-user support
- [ ] Automated backup and recovery
- [ ] Budget planning and analysis
- [ ] Investment recommendations engine
- [ ] Tax optimization suggestions
- [ ] Integration with financial APIs

---

**Made with ❤️ for Indian wealth builders**
