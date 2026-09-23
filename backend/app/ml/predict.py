import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "model.joblib")

_model = None

def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            from .train import train_and_save_model
            _model, _ = train_and_save_model()
        else:
            _model = joblib.load(MODEL_PATH)
    return _model

def get_score_band(score: int) -> str:
    if score >= 750:
        return "Excellent"
    elif score >= 650:
        return "Good"
    elif score >= 500:
        return "Fair"
    else:
        return "Poor"

SOURCE_WEIGHTS = {
    "upi": 25,
    "rent": 25,
    "utility_bill": 20,
    "mobile_recharge": 16
}

def predict_score(features: Dict[str, float], active_consents: Dict[str, bool] = None) -> Tuple[int, str, int, float]:
    """
    Predicts Inclusion Score (0-900), band, data coverage, and model confidence.
    Adjusts features based on active consents.
    """
    model = get_model()

    # Default consents if not provided
    if active_consents is None:
        active_consents = {
            "upi": True,
            "utility_bill": True,
            "mobile_recharge": True,
            "rent": True
        }

    # Calculate data coverage based on consented alternative channels (up to 86% for alternative data)
    coverage_pct = sum(SOURCE_WEIGHTS[src] for src, granted in active_consents.items() if granted and src in SOURCE_WEIGHTS)


    # Build feature row with baseline fallback if consent revoked
    # Neutral/conservative baseline for unconsented signals: 45.0
    adjusted_features = {
        "upi_consistency": features.get("upi_consistency", 75.0) if active_consents.get("upi", True) else 42.0,
        "upi_frequency": features.get("upi_frequency", 25.0) if active_consents.get("upi", True) else 10.0,
        "rent_regularity": features.get("rent_regularity", 80.0) if active_consents.get("rent", True) else 45.0,
        "utility_payment_timeliness": features.get("utility_payment_timeliness", 75.0) if active_consents.get("utility_bill", True) else 40.0,
        "recharge_consistency": features.get("recharge_consistency", 80.0) if active_consents.get("mobile_recharge", True) else 45.0,
        "income_stability": features.get("income_stability", 70.0),
        "transaction_regularity": features.get("transaction_regularity", 75.0) if active_consents.get("upi", True) else 40.0
    }

    df_row = pd.DataFrame([adjusted_features])
    raw_pred = model.predict(df_row)[0]

    # If data coverage is severely reduced, apply a confidence/coverage scaling
    if coverage_pct == 0:
        score = 300
        confidence = 0.30
    else:
        # Scale score according to model output
        score = int(round(np.clip(raw_pred, 300, 890)))
        confidence = round(0.70 + (coverage_pct / 100.0) * 0.25, 2)

    band = get_score_band(score)
    return score, band, coverage_pct, confidence
