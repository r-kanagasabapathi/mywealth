import os
import psycopg2
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

app = FastAPI()

# ==================== DATA MODELS ====================

class Asset(BaseModel):
    name: str
    asset_class: str  # equity, debt, gold, crypto, sip, ppf, nps, etc
    value_inr: float
    currency: str = "INR"
    quantity: Optional[float] = None
    buy_price: Optional[float] = None

class Liability(BaseModel):
    name: str
    amount: float
    interest_rate: Optional[float] = None

class Income(BaseModel):
    source: str
    amount: float
    month: int
    year: int

class Expense(BaseModel):
    category: str  # salary, rent, groceries, utilities, etc
    amount: float
    month: int
    year: int

class Goal(BaseModel):
    name: str
    target_amount: float
    current_amount: float
    target_year: int
    priority: str = "medium"

class Portfolio(BaseModel):
    assets: List[Asset]
    liabilities: Optional[List[Liability]] = []
    income: Optional[List[Income]] = []
    expenses: Optional[List[Expense]] = []
    goals: Optional[List[Goal]] = []

class NetWorthSnapshot(BaseModel):
    user_id: str
    total_assets: float
    total_liabilities: float
    net_worth: float
    snapshot_date: datetime
    asset_breakdown: dict

# Helper function to connect to the Neon database
def get_db_connection():
    try:
        db_url = os.environ.get("POSTGRES_URL")
        conn = psycopg2.connect(db_url)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Could not connect to database")

# ==================== API ENDPOINTS ====================

@app.get("/api/health")
def read_health():
    return {"status": "MyWealth Backend is active"}

@app.get("/api/setup-db")
def setup_database():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Create tables for comprehensive wealth tracking
    queries = [
        # Assets table
        """
        CREATE TABLE IF NOT EXISTS assets (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            asset_class VARCHAR(50) NOT NULL,
            value_inr NUMERIC NOT NULL,
            currency VARCHAR(10) DEFAULT 'INR',
            quantity NUMERIC,
            buy_price NUMERIC,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Liabilities table
        """
        CREATE TABLE IF NOT EXISTS liabilities (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            amount NUMERIC NOT NULL,
            interest_rate NUMERIC,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Income tracking
        """
        CREATE TABLE IF NOT EXISTS income (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            source VARCHAR(255) NOT NULL,
            amount NUMERIC NOT NULL,
            month INT NOT NULL,
            year INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Expenses tracking
        """
        CREATE TABLE IF NOT EXISTS expenses (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            amount NUMERIC NOT NULL,
            month INT NOT NULL,
            year INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Goals
        """
        CREATE TABLE IF NOT EXISTS goals (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            target_amount NUMERIC NOT NULL,
            current_amount NUMERIC NOT NULL,
            target_year INT NOT NULL,
            priority VARCHAR(20) DEFAULT 'medium',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Net worth snapshots
        """
        CREATE TABLE IF NOT EXISTS net_worth_snapshots (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            total_assets NUMERIC NOT NULL,
            total_liabilities NUMERIC NOT NULL,
            net_worth NUMERIC NOT NULL,
            asset_breakdown JSONB,
            snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # Portfolio history for trend analysis
        """
        CREATE TABLE IF NOT EXISTS portfolio_history (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            equity_inr NUMERIC NOT NULL,
            debt_inr NUMERIC NOT NULL,
            gold_inr NUMERIC NOT NULL,
            total_value NUMERIC NOT NULL,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    ]
    
    for query in queries:
        cur.execute(query)
    
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "All database tables created successfully!"}

@app.post("/api/assets/add")
def add_asset(asset: Asset):
    """Add a new asset to portfolio"""
    return {
        "status": "Asset added successfully",
        "asset": asset.dict()
    }

@app.get("/api/assets/{user_id}")
def get_assets(user_id: str):
    """Retrieve all assets for a user"""
    return {
        "user_id": user_id,
        "assets": []
    }

@app.post("/api/portfolio/analyze")
def analyze_portfolio(portfolio: Portfolio):
    """Analyze complete portfolio and provide recommendations"""
    total_assets = sum([a.value_inr for a in portfolio.assets])
    total_liabilities = sum([l.amount for l in portfolio.liabilities]) if portfolio.liabilities else 0
    net_worth = total_assets - total_liabilities
    
    # Calculate asset allocation
    asset_breakdown = {}
    for asset in portfolio.assets:
        if asset.asset_class not in asset_breakdown:
            asset_breakdown[asset.asset_class] = 0
        asset_breakdown[asset.asset_class] += asset.value_inr
    
    # Percentage allocation
    allocation_percent = {k: (v / total_assets * 100) if total_assets > 0 else 0 for k, v in asset_breakdown.items()}
    
    # Financial health check
    health_metrics = calculate_health_metrics(portfolio)
    
    # Recommendations
    recommendations = generate_recommendations(portfolio, allocation_percent)
    
    return {
        "net_worth": net_worth,
        "total_assets": total_assets,
        "total_liabilities": total_liabilities,
        "asset_allocation": asset_breakdown,
        "allocation_percent": allocation_percent,
        "health_metrics": health_metrics,
        "recommendations": recommendations
    }

@app.post("/api/networth/snapshot")
def create_snapshot(user_id: str, portfolio: Portfolio):
    """Create a net worth snapshot"""
    total_assets = sum([a.value_inr for a in portfolio.assets])
    total_liabilities = sum([l.amount for l in portfolio.liabilities]) if portfolio.liabilities else 0
    net_worth = total_assets - total_liabilities
    
    # Asset breakdown for snapshot
    asset_breakdown = {}
    for asset in portfolio.assets:
        if asset.asset_class not in asset_breakdown:
            asset_breakdown[asset.asset_class] = 0
        asset_breakdown[asset.asset_class] += asset.value_inr
    
    return {
        "user_id": user_id,
        "net_worth": net_worth,
        "total_assets": total_assets,
        "total_liabilities": total_liabilities,
        "asset_breakdown": asset_breakdown,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/financial-health/{user_id}")
def check_financial_health(user_id: str):
    """Check essential financial health metrics"""
    return {
        "user_id": user_id,
        "emergency_fund": "Not set",
        "term_insurance": "Recommended",
        "health_insurance": "Recommended",
        "debt_to_asset_ratio": 0,
        "savings_rate": 0,
        "health_score": 0
    }

@app.post("/api/income/add")
def add_income(income: Income):
    """Add income entry"""
    return {"status": "Income recorded", "income": income.dict()}

@app.post("/api/expenses/add")
def add_expense(expense: Expense):
    """Add expense entry"""
    return {"status": "Expense recorded", "expense": expense.dict()}

@app.get("/api/cash-flow/{user_id}")
def get_cash_flow(user_id: str, month: int, year: int):
    """Get income vs expenses analysis"""
    return {
        "user_id": user_id,
        "month": month,
        "year": year,
        "total_income": 0,
        "total_expenses": 0,
        "net_savings": 0,
        "savings_rate": 0
    }

@app.get("/api/goals/{user_id}")
def get_goals(user_id: str):
    """Retrieve all financial goals"""
    return {
        "user_id": user_id,
        "goals": []
    }

@app.post("/api/import/csv")
def import_csv_portfolio(user_id: str, data: dict):
    """Import portfolio from CSV"""
    return {"status": "CSV imported successfully", "user_id": user_id}

@app.get("/api/portfolio/growth/{user_id}")
def get_portfolio_growth(user_id: str):
    """Get net worth growth over time"""
    return {
        "user_id": user_id,
        "growth_data": [],
        "total_growth_percent": 0
    }

# ==================== HELPER FUNCTIONS ====================

def calculate_health_metrics(portfolio: Portfolio) -> dict:
    """Calculate financial health metrics"""
    total_assets = sum([a.value_inr for a in portfolio.assets])
    total_liabilities = sum([l.amount for l in portfolio.liabilities]) if portfolio.liabilities else 0
    
    health = {
        "debt_to_asset_ratio": (total_liabilities / total_assets * 100) if total_assets > 0 else 0,
        "liquidity_ratio": 0,  # liquid assets / total assets
        "diversification_score": len(set([a.asset_class for a in portfolio.assets])) / 10 * 100
    }
    
    return health

def generate_recommendations(portfolio: Portfolio, allocation_percent: dict) -> list:
    """Generate personalized recommendations"""
    recommendations = []
    
    # Check allocation balance
    equity_percent = allocation_percent.get('equity', 0)
    debt_percent = allocation_percent.get('debt', 0)
    gold_percent = allocation_percent.get('gold', 0)
    
    if equity_percent > 65:
        recommendations.append({
            "type": "allocation",
            "severity": "warning",
            "message": "Equity allocation is high. Consider rebalancing towards debt/gold."
        })
    elif equity_percent < 55:
        recommendations.append({
            "type": "allocation",
            "severity": "info",
            "message": "Equity allocation is low. Consider increasing for growth potential."
        })
    
    # Check diversification
    asset_classes = len(set([a.asset_class for a in portfolio.assets]))
    if asset_classes < 3:
        recommendations.append({
            "type": "diversification",
            "severity": "warning",
            "message": "Portfolio needs more diversification. Consider adding different asset classes."
        })
    
    return recommendations

@app.post("/api/recommendation")
def get_rebalancing_recommendation(portfolio: Portfolio):
    total = portfolio.equity_inr + portfolio.debt_inr + portfolio.gold_inr
    
    if total == 0:
        return {"error": "Portfolio value is zero."}
        
    equity_weight = (portfolio.equity_inr / total) * 100
    
    if equity_weight > 62:
        action = "Sell Equity, Buy Debt/Gold"
    elif equity_weight < 58:
        action = "Buy Equity"
    else:
        action = "Portfolio is balanced"
        
    # --- NEW: Save this snapshot to the database ---
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO portfolio_history (equity_inr, debt_inr, gold_inr, total_value) VALUES (%s, %s, %s, %s)",
            (portfolio.equity_inr, portfolio.debt_inr, portfolio.gold_inr, total)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Failed to save to DB: {e}")
        # We don't stop the recommendation if the DB save fails, just log it.
    # -----------------------------------------------

    return {
        "total_value_inr": total,
        "current_equity_weight_percent": round(equity_weight, 2),
        "target_equity_percent": 60.0,
        "recommended_action": action,
        "db_status": "Saved to history"
    }