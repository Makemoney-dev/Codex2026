import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    occupation = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    consents = relationship("Consent", back_populates="borrower", cascade="all, delete-orphan")
    alternative_data = relationship("AlternativeData", back_populates="borrower", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="borrower", cascade="all, delete-orphan")
    access_logs = relationship("AccessLog", back_populates="borrower", cascade="all, delete-orphan")


class Consent(Base):
    __tablename__ = "consent"

    id = Column(Integer, primary_key=True, index=True)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    source = Column(String(50), nullable=False)  # 'upi', 'utility_bill', 'mobile_recharge', 'rent'
    granted = Column(Boolean, default=True, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    borrower = relationship("Borrower", back_populates="consents")


class AlternativeData(Base):
    __tablename__ = "alternative_data"

    id = Column(Integer, primary_key=True, index=True)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    source = Column(String(50), nullable=False)  # 'upi', 'utility_bill', 'mobile_recharge', 'rent', 'income'
    feature_values_json = Column(Text, nullable=False)  # JSON string of raw / engineered signals
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    borrower = relationship("Borrower", back_populates="alternative_data")


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    score = Column(Integer, nullable=False)  # 0 to 900
    band = Column(String(50), nullable=False)  # 'Poor', 'Fair', 'Good', 'Excellent'
    confidence = Column(Float, default=0.85)
    data_coverage = Column(Integer, default=100)  # Percentage, e.g. 86%
    monthly_change = Column(Integer, default=0)  # e.g. +28
    model_version = Column(String(50), default="v1.0.0-gbr")
    computed_at = Column(DateTime, default=datetime.datetime.utcnow)

    borrower = relationship("Borrower", back_populates="scores")
    explanations = relationship("ScoreExplanation", back_populates="score_rel", cascade="all, delete-orphan")


class ScoreExplanation(Base):
    __tablename__ = "explanations"

    id = Column(Integer, primary_key=True, index=True)
    score_id = Column(Integer, ForeignKey("scores.id"), nullable=False)
    feature_name = Column(String(100), nullable=False)
    shap_value = Column(Float, nullable=False)
    direction = Column(String(20), nullable=False)  # 'positive', 'negative', 'neutral'
    reason = Column(String(255), nullable=False)
    impact_points = Column(Integer, default=0)

    score_rel = relationship("Score", back_populates="explanations")


class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    lender_id = Column(String(50), nullable=False, default="lender_01")
    lender_name = Column(String(120), nullable=False, default="Mumbai Finance Ltd")
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    purpose = Column(String(120), default="Credit Assessment")
    accessed_at = Column(DateTime, default=datetime.datetime.utcnow)

    borrower = relationship("Borrower", back_populates="access_logs")
