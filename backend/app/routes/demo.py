from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Borrower, Score
from ..schemas import DemoLoginRequest, DemoLoginResponse, BorrowerSummary

router = APIRouter(prefix="/api/demo", tags=["Demo"])

@router.post("/login", response_model=DemoLoginResponse)
def demo_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    password = req.password.strip()

    if password != "demo123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid demo password. Use 'demo123'."
        )

    if email in ["lender@invisiblescore.com", "lender@demo.com", "lender@score.com"]:
        return DemoLoginResponse(
            success=True,
            role="lender",
            borrower_id=None,
            name="Mumbai Finance Ltd",
            token="lender-token-2026",
            message="Logged in as Lender"
        )
    elif email in ["borrower@invisiblescore.com", "borrower@demo.com", "borrower@score.com"]:
        borrower = db.query(Borrower).first()
        b_id = borrower.id if borrower else 1
        b_name = borrower.name if borrower else "Rahul Sharma"
        return DemoLoginResponse(
            success=True,
            role="borrower",
            borrower_id=b_id,
            name=b_name,
            token="borrower-token-2026",
            message=f"Logged in as {b_name}"
        )
    else:
        # Check if email belongs to any seeded borrower
        borrower = db.query(Borrower).filter(Borrower.email == email).first()
        if borrower:
            return DemoLoginResponse(
                success=True,
                role="borrower",
                borrower_id=borrower.id,
                name=borrower.name,
                token=f"borrower-token-{borrower.id}",
                message=f"Logged in as {borrower.name}"
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found. Try 'borrower@invisiblescore.com' or 'lender@invisiblescore.com'."
        )

@router.get("/borrowers", response_model=List[BorrowerSummary])
def get_demo_borrowers(db: Session = Depends(get_db)):
    borrowers = db.query(Borrower).all()
    summaries = []
    for b in borrowers:
        latest_score = db.query(Score).filter(Score.borrower_id == b.id).order_by(Score.computed_at.desc()).first()
        score_val = latest_score.score if latest_score else 742
        band_val = latest_score.band if latest_score else "Good"
        cov_val = latest_score.data_coverage if latest_score else 86

        summaries.append(BorrowerSummary(
            id=b.id,
            name=b.name,
            email=b.email,
            occupation=b.occupation,
            city=b.city,
            current_score=score_val,
            band=band_val,
            coverage=cov_val
        ))
    return summaries
