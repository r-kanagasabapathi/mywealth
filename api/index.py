from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Portfolio(BaseModel):
    equity_inr: float
    debt_inr: float
    gold_inr: float

@app.get("/api/health")
def read_health():
    return {"status": "Python Backend is active"}

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
        
    return {
        "total_value_inr": total,
        "current_equity_weight_percent": round(equity_weight, 2),
        "target_equity_percent": 60.0,
        "recommended_action": action
    }