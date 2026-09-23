import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

FEATURE_NAMES = [
    "upi_consistency",
    "upi_frequency",
    "rent_regularity",
    "utility_payment_timeliness",
    "recharge_consistency",
    "income_stability",
    "transaction_regularity"
]

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

def generate_synthetic_data(num_samples: int = 1000, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)

    # Behavioral metrics: 0 to 100 scale (except upi_frequency which is count/month)
    upi_consistency = np.random.beta(5, 2, num_samples) * 100
    upi_frequency = np.random.gamma(6, 4, num_samples)  # 5 to 50 tx/month
    rent_regularity = np.random.beta(6, 2, num_samples) * 100
    utility_payment_timeliness = np.random.beta(5, 2.5, num_samples) * 100
    recharge_consistency = np.random.beta(6, 2, num_samples) * 100
    income_stability = np.random.beta(4, 2.5, num_samples) * 100
    transaction_regularity = (upi_consistency * 0.6 + np.random.beta(5, 3, num_samples) * 40)

    # Core scoring formula (ground truth prudence simulation)
    raw_score = (
        0.26 * rent_regularity +
        0.24 * upi_consistency +
        0.18 * utility_payment_timeliness +
        0.10 * recharge_consistency +
        0.14 * income_stability +
        0.08 * transaction_regularity
    )

    # Target score calibrated to 320 - 860 range with mild gaussian noise
    noise = np.random.normal(0, 15, num_samples)
    target_score = 300 + (raw_score / 100.0) * 550 + noise
    target_score = np.clip(target_score, 300, 890).round().astype(int)

    df = pd.DataFrame({
        "upi_consistency": upi_consistency.round(1),
        "upi_frequency": upi_frequency.round(1),
        "rent_regularity": rent_regularity.round(1),
        "utility_payment_timeliness": utility_payment_timeliness.round(1),
        "recharge_consistency": recharge_consistency.round(1),
        "income_stability": income_stability.round(1),
        "transaction_regularity": transaction_regularity.round(1),
        "score": target_score
    })
    return df

def train_and_save_model():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    df = generate_synthetic_data(1000)

    X = df[FEATURE_NAMES]
    y = df["score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.08,
        random_state=42
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mse = mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    # Save artifacts
    model_path = os.path.join(ARTIFACTS_DIR, "model.joblib")
    background_path = os.path.join(ARTIFACTS_DIR, "background.joblib")
    meta_path = os.path.join(ARTIFACTS_DIR, "metadata.json")

    joblib.dump(model, model_path)
    # Save a 100-sample background for SHAP reference
    joblib.dump(X_train.sample(100, random_state=42), background_path)

    metadata = {
        "model_version": "v1.0.0-gbr",
        "algorithm": "GradientBoostingRegressor",
        "n_estimators": 100,
        "features": FEATURE_NAMES,
        "samples_trained": len(X_train),
        "metrics": {
            "rmse": round(float(np.sqrt(mse)), 2),
            "r2_score": round(float(r2), 4)
        }
    }
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model trained and saved to {model_path}. R2 Score: {r2:.4f}, RMSE: {np.sqrt(mse):.2f}")
    return model, metadata

if __name__ == "__main__":
    train_and_save_model()
