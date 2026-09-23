from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Borrower, Score, ScoreExplanation, AccessLog
from ..schemas import LenderBorrowerAssessment, ExplainableFactor, AccessLogItem, BorrowerSummary

router = APIRouter(prefix="/api/lender", tags=["Lender"])

def time_ago(dt: datetime) -> str:
    diff = datetime.utcnow() - dt
    seconds = diff.total_seconds()
    if seconds < 60:
        return f"{int(max(1, seconds))}s ago"
    elif seconds < 3600:
        return f"{int(seconds // 60)} mins ago"
    elif seconds < 86400:
        return f"{int(seconds // 3600)} hours ago"
    else:
        return f"{int(seconds // 86400)} days ago"

@router.get("/borrowers", response_model=List[BorrowerSummary])
def list_borrowers_for_lender(db: Session = Depends(get_db)):
    borrowers = db.query(Borrower).all()
    results = []
    for b in borrowers:
        latest_score = db.query(Score).filter(Score.borrower_id == b.id).order_by(Score.computed_at.desc()).first()
        score_val = latest_score.score if latest_score else 742
        band_val = latest_score.band if latest_score else "Good"
        cov_val = latest_score.data_coverage if latest_score else 86

        results.append(BorrowerSummary(
            id=b.id,
            name=b.name,
            email=b.email,
            occupation=b.occupation,
            city=b.city,
            current_score=score_val,
            band=band_val,
            coverage=cov_val
        ))
    return results

@router.get("/borrower/{borrower_id}", response_model=LenderBorrowerAssessment)
def get_borrower_assessment(borrower_id: int, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    latest_score = db.query(Score).filter(Score.borrower_id == borrower_id).order_by(Score.computed_at.desc()).first()
    score_val = latest_score.score if latest_score else 742
    band_val = latest_score.band if latest_score else "Good"
    cov_val = latest_score.data_coverage if latest_score else 86

    # Log access transparently
    access_entry = AccessLog(
        lender_id="lender_01",
        lender_name="Mumbai Finance Ltd",
        borrower_id=borrower_id,
        purpose="Credit Assessment Inquiry",
        accessed_at=datetime.utcnow()
    )
    db.add(access_entry)
    db.commit()

    # Get explainable factors (derived from SHAP without leaking raw transaction values)
    factors: List[ExplainableFactor] = []
    if latest_score:
        exps = db.query(ScoreExplanation).filter(ScoreExplanation.score_id == latest_score.id).all()
        for e in exps:
            # Map to clean high-level lender-friendly factor
            label_map = {
                "upi_consistency": "UPI Consistency",
                "upi_frequency": "Digital Transaction Volume",
                "rent_regularity": "Rent Regularity",
                "utility_payment_timeliness": "Utility Bill Timeliness",
                "recharge_consistency": "Mobile Recharge Regularity",
                "income_stability": "Income Stability",
                "transaction_regularity": "Spending Regularity"
            }
            clean_name = label_map.get(e.feature_name, e.feature_name.replace("_", " ").title())
            dir_label = "Positive" if e.direction == "positive" else ("Negative" if e.direction == "negative" else "Neutral")
            
            factors.append(ExplainableFactor(
                factor=clean_name,
                direction=dir_label,
                impact_text=f"{dir_label} factor (+{e.impact_points} pts)" if e.impact_points > 0 else f"{dir_label} factor ({e.impact_points} pts)"
            ))

    if not factors:
        factors = [
            ExplainableFactor(factor="UPI Consistency", direction="Positive", impact_text="Consistent transaction pattern"),
            ExplainableFactor(factor="Rent Regularity", direction="Positive", impact_text="Timely rental settlements"),
            ExplainableFactor(factor="Utility Payments", direction="Positive", impact_text="Regular utility bill payments"),
            ExplainableFactor(factor="Income Stability", direction="Neutral", impact_text="Slight income variance")
        ]

    return LenderBorrowerAssessment(
        borrower_id=borrower.id,
        name=borrower.name,
        occupation=borrower.occupation,
        city=borrower.city,
        score=score_val,
        band=band_val,
        data_coverage=cov_val,
        explainable_factors=factors,
        privacy_notice="Lenders receive an explainable score, not raw financial data. Raw transaction logs are strictly confidential."
    )

@router.get("/access-log", response_model=List[AccessLogItem])
def get_access_logs(db: Session = Depends(get_db)):
    logs = db.query(AccessLog).order_by(AccessLog.accessed_at.desc()).limit(20).all()
    results = []
    for l in logs:
        b = db.query(Borrower).filter(Borrower.id == l.borrower_id).first()
        b_name = b.name if b else f"Borrower #{l.borrower_id}"
        results.append(AccessLogItem(
            id=l.id,
            lender_name=l.lender_name,
            borrower_name=b_name,
            accessed_at=time_ago(l.accessed_at),
            purpose=l.purpose
        ))
    return results
