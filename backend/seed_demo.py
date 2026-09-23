import json
import datetime
from app.database import engine, Base, SessionLocal
from app.models import Borrower, Consent, AlternativeData, Score, ScoreExplanation, AccessLog
from app.ml.train import train_and_save_model
from app.ml.predict import predict_score
from app.ml.explain import explain_prediction

def seed():
    print("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)

    print("Training ML model & generating artifacts...")
    train_and_save_model()

    db = SessionLocal()

    # Clear existing demo data to ensure a clean state
    db.query(AccessLog).delete()
    db.query(ScoreExplanation).delete()
    db.query(Score).delete()
    db.query(AlternativeData).delete()
    db.query(Consent).delete()
    db.query(Borrower).delete()
    db.commit()

    print("Seeding demo borrowers...")
    borrowers_data = [
        {
            "name": "Rahul Sharma",
            "email": "borrower@demo.com",
            "occupation": "Delivery Partner",
            "city": "Mumbai",
            "monthly_change": 28,
            "features": {
                "upi_consistency": 84.3,
                "upi_frequency": 29.0,
                "rent_regularity": 88.0,
                "utility_payment_timeliness": 80.0,
                "recharge_consistency": 78.0,
                "income_stability": 65.0,
                "transaction_regularity": 80.5
            },
            "consents": {"upi": True, "utility_bill": True, "mobile_recharge": True, "rent": True}
        },
        {
            "name": "Amit Patel",
            "email": "amit@demo.com",
            "occupation": "Small Retailer",
            "city": "Ahmedabad",
            "monthly_change": 14,
            "features": {
                "upi_consistency": 82.0,
                "upi_frequency": 42.0,
                "rent_regularity": 85.0,
                "utility_payment_timeliness": 78.0,
                "recharge_consistency": 90.0,
                "income_stability": 68.0,
                "transaction_regularity": 80.0
            },
            "consents": {"upi": True, "utility_bill": True, "mobile_recharge": True, "rent": True}
        },
        {
            "name": "Priya Verma",
            "email": "priya@demo.com",
            "occupation": "Freelance Designer",
            "city": "Bengaluru",
            "monthly_change": 35,
            "features": {
                "upi_consistency": 96.0,
                "upi_frequency": 50.0,
                "rent_regularity": 98.0,
                "utility_payment_timeliness": 94.0,
                "recharge_consistency": 92.0,
                "income_stability": 88.0,
                "transaction_regularity": 94.0
            },
            "consents": {"upi": True, "utility_bill": True, "mobile_recharge": True, "rent": True}
        },
        {
            "name": "Sneha Joshi",
            "email": "sneha@demo.com",
            "occupation": "Micro-Vendor / Artisan",
            "city": "Pune",
            "monthly_change": 8,
            "features": {
                "upi_consistency": 60.0,
                "upi_frequency": 18.0,
                "rent_regularity": 65.0,
                "utility_payment_timeliness": 62.0,
                "recharge_consistency": 58.0,
                "income_stability": 52.0,
                "transaction_regularity": 59.0
            },
            "consents": {"upi": True, "utility_bill": True, "mobile_recharge": True, "rent": True}
        }
    ]

    for b_info in borrowers_data:
        borrower = Borrower(
            name=b_info["name"],
            email=b_info["email"],
            occupation=b_info["occupation"],
            city=b_info["city"]
        )
        db.add(borrower)
        db.commit()
        db.refresh(borrower)

        # Add consents
        for src, granted in b_info["consents"].items():
            c = Consent(borrower_id=borrower.id, source=src, granted=granted)
            db.add(c)
        db.commit()

        # Add alternative data
        alt = AlternativeData(
            borrower_id=borrower.id,
            source="all",
            feature_values_json=json.dumps(b_info["features"])
        )
        db.add(alt)
        db.commit()

        # Compute model-based score
        score_val, band_val, cov_val, conf_val = predict_score(b_info["features"], b_info["consents"])
        score_rec = Score(
            borrower_id=borrower.id,
            score=score_val,
            band=band_val,
            confidence=conf_val,
            data_coverage=cov_val,
            monthly_change=b_info["monthly_change"],
            model_version="v1.0.0-gbr",
            computed_at=datetime.datetime.utcnow()
        )
        db.add(score_rec)
        db.commit()
        db.refresh(score_rec)

        # Generate and save SHAP explanations
        exps = explain_prediction(b_info["features"], b_info["consents"])
        for e in exps:
            db.add(ScoreExplanation(
                score_id=score_rec.id,
                feature_name=e["feature_name"],
                shap_value=e["shap_value"],
                direction=e["direction"],
                reason=e["reason"],
                impact_points=e["impact_points"]
            ))
        db.commit()
        print(f"Seeded {borrower.name}: Score {score_val} ({band_val}), Coverage: {cov_val}%")

    # Preload sample access logs
    print("Seeding initial lender access logs...")
    b_first = db.query(Borrower).first()
    b_second = db.query(Borrower).filter(Borrower.id != b_first.id).first()

    now = datetime.datetime.utcnow()
    logs = [
        AccessLog(
            lender_id="lender_01",
            lender_name="Mumbai Finance Ltd",
            borrower_id=b_first.id,
            purpose="Credit Assessment Inquiry",
            accessed_at=now - datetime.timedelta(minutes=2)
        ),
        AccessLog(
            lender_id="lender_02",
            lender_name="ABC Microcredit",
            borrower_id=b_first.id,
            purpose="Inclusion Verification",
            accessed_at=now - datetime.timedelta(days=1)
        ),
        AccessLog(
            lender_id="lender_01",
            lender_name="Mumbai Finance Ltd",
            borrower_id=b_second.id if b_second else b_first.id,
            purpose="Working Capital Assessment",
            accessed_at=now - datetime.timedelta(days=2)
        )
    ]
    for log in logs:
        db.add(log)
    db.commit()
    db.close()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
