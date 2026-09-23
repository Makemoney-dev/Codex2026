import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Borrower, Consent, AlternativeData, Score, ScoreExplanation
from ..schemas import ConsentItem, ConsentToggleRequest, ConsentToggleResponse
from ..ml.predict import predict_score
from ..ml.explain import explain_prediction

router = APIRouter(prefix="/api/consent", tags=["Consent"])

SOURCE_META = {
    "upi": {
        "label": "UPI Transactions",
        "description": "Used to understand transaction consistency and financial activity cadence."
    },
    "utility_bill": {
        "label": "Utility Bills",
        "description": "Used to assess payment timeliness for electricity, gas, and water utilities."
    },
    "mobile_recharge": {
        "label": "Mobile Recharge",
        "description": "Used to evaluate regular recharge frequency and communication continuity."
    },
    "rent": {
        "label": "Rent Payments",
        "description": "Used to evaluate housing payment regularity and long-term obligation consistency."
    }
}

@router.get("/{borrower_id}", response_model=List[ConsentItem])
def get_borrower_consent(borrower_id: int, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    consents = db.query(Consent).filter(Consent.borrower_id == borrower_id).all()
    consent_dict = {c.source: c for c in consents}

    results = []
    for source_key, meta in SOURCE_META.items():
        if source_key in consent_dict:
            c = consent_dict[source_key]
            results.append(ConsentItem(
                source=source_key,
                source_label=meta["label"],
                granted=c.granted,
                updated_at=c.updated_at,
                usage_description=meta["description"]
            ))
        else:
            # Create default granted consent if missing
            new_c = Consent(borrower_id=borrower_id, source=source_key, granted=True)
            db.add(new_c)
            db.commit()
            db.refresh(new_c)
            results.append(ConsentItem(
                source=source_key,
                source_label=meta["label"],
                granted=True,
                updated_at=new_c.updated_at,
                usage_description=meta["description"]
            ))

    return results

@router.post("/{borrower_id}", response_model=ConsentToggleResponse)
def toggle_borrower_consent(borrower_id: int, req: ConsentToggleRequest, db: Session = Depends(get_db)):
    borrower = db.query(Borrower).filter(Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    if req.source not in SOURCE_META:
        raise HTTPException(status_code=400, detail=f"Invalid source '{req.source}'")

    consent = db.query(Consent).filter(
        Consent.borrower_id == borrower_id,
        Consent.source == req.source
    ).first()

    if not consent:
        consent = Consent(borrower_id=borrower_id, source=req.source, granted=req.granted)
        db.add(consent)
    else:
        consent.granted = req.granted
        consent.updated_at = datetime.utcnow()

    db.commit()

    # Re-fetch all consents
    all_consents = db.query(Consent).filter(Consent.borrower_id == borrower_id).all()
    active_consents = {c.source: c.granted for c in all_consents}

    # Fetch alternative data features
    alt_records = db.query(AlternativeData).filter(AlternativeData.borrower_id == borrower_id).all()
    features = {}
    for r in alt_records:
        try:
            vals = json.loads(r.feature_values_json)
            features.update(vals)
        except Exception:
            pass

    # If no features in DB, provide realistic defaults
    if not features:
        features = {
            "upi_consistency": 92.0,
            "upi_frequency": 38.0,
            "rent_regularity": 95.0,
            "utility_payment_timeliness": 88.0,
            "recharge_consistency": 84.0,
            "income_stability": 78.0,
            "transaction_regularity": 90.0
        }

    # Compute new score dynamically using ML model
    new_score_val, new_band, coverage, conf = predict_score(features, active_consents)
    explanations = explain_prediction(features, active_consents)

    # Save new score
    latest_score = db.query(Score).filter(Score.borrower_id == borrower_id).order_by(Score.computed_at.desc()).first()
    prev_score = latest_score.score if latest_score else new_score_val
    monthly_change = new_score_val - prev_score

    score_rec = Score(
        borrower_id=borrower_id,
        score=new_score_val,
        band=new_band,
        confidence=conf,
        data_coverage=coverage,
        monthly_change=monthly_change,
        model_version="v1.0.0-gbr",
        computed_at=datetime.utcnow()
    )
    db.add(score_rec)
    db.commit()
    db.refresh(score_rec)

    # Save explanations
    for exp in explanations:
        db.add(ScoreExplanation(
            score_id=score_rec.id,
            feature_name=exp["feature_name"],
            shap_value=exp["shap_value"],
            direction=exp["direction"],
            reason=exp["reason"],
            impact_points=exp["impact_points"]
        ))
    db.commit()

    action = "granted" if req.granted else "revoked"
    return ConsentToggleResponse(
        success=True,
        source=req.source,
        granted=req.granted,
        new_data_coverage=coverage,
        new_score=new_score_val,
        new_band=new_band,
        message=f"Consent for {SOURCE_META[req.source]['label']} {action}. Inclusion Score recalculated."
    )
