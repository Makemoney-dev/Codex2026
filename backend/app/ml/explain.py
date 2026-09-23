import os
import shap
import numpy as np
import pandas as pd
from typing import List, Dict, Any
from .predict import get_model

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

_explainer = None

FEATURE_LABELS_POSITIVE = {
    "upi_consistency": "Consistent UPI activity",
    "upi_frequency": "Frequent digital payment usage",
    "rent_regularity": "Regular rent payments",
    "utility_payment_timeliness": "Timely utility bill payments",
    "recharge_consistency": "Consistent mobile recharge cycle",
    "income_stability": "Stable monthly earnings pattern",
    "transaction_regularity": "Predictable day-to-day spending pattern"
}

FEATURE_LABELS_NEGATIVE = {
    "upi_consistency": "Recent irregular UPI transaction volume",
    "upi_frequency": "Low transaction volume recorded",
    "rent_regularity": "Delays in monthly rent payment cycle",
    "utility_payment_timeliness": "Delayed utility bill settlements",
    "recharge_consistency": "Gaps between mobile recharges",
    "income_stability": "Irregular income variance",
    "transaction_regularity": "Unpredictable spikes in spending"
}

def get_explainer():
    global _explainer
    if _explainer is None:
        model = get_model()
        _explainer = shap.TreeExplainer(model)
    return _explainer

def explain_prediction(features: Dict[str, float], active_consents: Dict[str, bool] = None) -> List[Dict[str, Any]]:
    """
    Computes real SHAP values for the borrower features, returns sorted plain-language explanations.
    """
    explainer = get_explainer()

    if active_consents is None:
        active_consents = {"upi": True, "utility_bill": True, "mobile_recharge": True, "rent": True}

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
    shap_vals = explainer.shap_values(df_row)[0]

    explanations = []
    feature_names = list(adjusted_features.keys())

    for feat_name, shap_val in zip(feature_names, shap_vals):
        val = float(shap_val)
        impact = int(round(val))

        # Check if consent is revoked for this feature's source
        is_consented = True
        if feat_name in ["upi_consistency", "upi_frequency", "transaction_regularity"] and not active_consents.get("upi", True):
            is_consented = False
        elif feat_name == "rent_regularity" and not active_consents.get("rent", True):
            is_consented = False
        elif feat_name == "utility_payment_timeliness" and not active_consents.get("utility_bill", True):
            is_consented = False
        elif feat_name == "recharge_consistency" and not active_consents.get("mobile_recharge", True):
            is_consented = False

        if not is_consented:
            direction = "neutral"
            reason = f"Data source unconsented — baseline substitution applied"
            impact = 0
        elif val >= 1.5:
            direction = "positive"
            reason = f"{FEATURE_LABELS_POSITIVE.get(feat_name, feat_name)} positively contributed to your score."
        elif val <= -1.5:
            direction = "negative"
            reason = f"{FEATURE_LABELS_NEGATIVE.get(feat_name, feat_name)} reduced the score."
        else:
            direction = "neutral"
            reason = f"{FEATURE_LABELS_POSITIVE.get(feat_name, feat_name)} had a neutral impact."

        explanations.append({
            "feature_name": feat_name,
            "shap_value": round(val, 2),
            "direction": direction,
            "reason": reason,
            "impact_points": impact
        })

    # Sort by absolute impact points descending
    explanations.sort(key=lambda x: abs(x["impact_points"]), reverse=True)
    return explanations
