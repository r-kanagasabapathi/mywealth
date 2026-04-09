import os
import psycopg2
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Portfolio(BaseModel):
    equity_inr: float
    debt_inr: float
    gold_inr: float

# Helper function to connect to the Neon database
def get_db_connection():
    try:
        # Vercel automatically provides the POSTGRES_URL environment variable
        db_url = os.environ.get("POSTGRES_URL")
        conn = psycopg2.connect(db_url)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Could not connect to database")

@app.get("/api/health")
def read_health():
    return {"status": "Python Backend is active"}

# A temporary endpoint to create your database tables
@app.get("/api/setup-db")
def setup_database():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Create a table to track portfolio history
    create_table_query = """
    CREATE TABLE IF NOT EXISTS portfolio_history (
        id SERIAL PRIMARY KEY,
        equity_inr NUMERIC NOT NULL,
        debt_inr NUMERIC NOT NULL,
        gold_inr NUMERIC NOT NULL,
        total_value NUMERIC NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    cur.execute(create_table_query)
    conn.commit()
    
    cur.close()
    conn.close()
    return {"message": "Database table 'portfolio_history' created successfully!"}

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