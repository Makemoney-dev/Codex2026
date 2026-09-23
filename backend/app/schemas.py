from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# Demo & Auth Schemas
class DemoLoginRequest(BaseModel):
    email: str
    password: str

class DemoLoginResponse(BaseModel):
    success: bool
    role: str  # 'borrower' or 'lender'
    borrower_id: Optional[int] = None
    name: str
    token: str
    message: str

class BorrowerSummary(BaseModel):
    id: int
    name: str
    email: str
    occupation: str
    city: str
    current_score: int
    band: str
    coverage: int

# Consent Schemas
class ConsentItem(BaseModel):
    source: str
    source_label: str
    granted: bool
    updated_at: Optional[datetime] = None
    usage_description: str

class ConsentToggleRequest(BaseModel):
    source: str
    granted: bool

class ConsentToggleResponse(BaseModel):
    success: bool
    source: str
    granted: bool
    new_data_coverage: int
    new_score: int
    new_band: str
    message: str

# Alternative Data Cards
class AlternativeDataCard(BaseModel):
    source: str
    title: str
    status_label: str  # 'High', 'Excellent', 'Good', 'Regular'
    percentage: int  # 0 to 100
    description: str

# SHAP Explanation Schema
class ExplanationItem(BaseModel):
    feature_name: str
    shap_value: float
    direction: str  # 'positive', 'negative', 'neutral'
    reason: str
    impact_points: int

# Score Schemas
class ScoreResponse(BaseModel):
    borrower_id: int
    borrower_name: str
    occupation: str
    city: str
    score: int
    band: str
    confidence: float
    data_coverage: int
    monthly_change: int
    computed_at: datetime
    model_version: str
    alternative_data: List[AlternativeDataCard]
    explanations: List[ExplanationItem]

class ScoreHistoryItem(BaseModel):
    month: str
    score: int

# Simulation Schemas
class SimulateRequest(BaseModel):
    upi_consistency: float = Field(ge=0, le=100)
    rent_regularity: float = Field(ge=0, le=100)
    utility_payment_timeliness: float = Field(ge=0, le=100)
    recharge_consistency: float = Field(ge=0, le=100)

class SimulateResponse(BaseModel):
    current_score: int
    projected_score: int
    change_points: int
    current_band: str
    projected_band: str
    note: str

# Lender Schemas
class ExplainableFactor(BaseModel):
    factor: str
    direction: str  # 'Positive', 'Negative', 'Neutral'
    impact_text: str

class LenderBorrowerAssessment(BaseModel):
    borrower_id: int
    name: str
    occupation: str
    city: str
    score: int
    band: str
    data_coverage: int
    explainable_factors: List[ExplainableFactor]
    privacy_notice: str

class AccessLogItem(BaseModel):
    id: int
    lender_name: str
    borrower_name: str
    accessed_at: str
    purpose: str
