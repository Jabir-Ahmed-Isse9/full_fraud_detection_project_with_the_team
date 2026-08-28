from contextlib import asynccontextmanager
from pathlib import Path
import sys
from typing import Literal

# Ensure a local dependency bundle is selected before importing FastAPI.  A
# compiled pydantic-core wheel from another Python version cannot be reused.
BASE_DIR = Path(__file__).resolve().parent
LOCAL_RUNTIME = BASE_DIR / f'.runtime{sys.version_info.major}{sys.version_info.minor}'
if not LOCAL_RUNTIME.exists() and sys.version_info[:2] == (3, 12):
    LOCAL_RUNTIME = BASE_DIR / '.runtime'
runtime_is_compatible = (
    LOCAL_RUNTIME.exists()
    and (LOCAL_RUNTIME / 'fastapi' / '__init__.py').exists()
    and any(
        (LOCAL_RUNTIME / 'pydantic_core').glob(
            f'_pydantic_core.cp{sys.version_info.major}{sys.version_info.minor}-*.pyd'
        )
    )
)
if runtime_is_compatible:
    sys.path.insert(0, str(LOCAL_RUNTIME))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from inference import ModelRegistry

MODEL_DIRECTORY = Path(__file__).resolve().parent / 'models'
registry = ModelRegistry(MODEL_DIRECTORY)


class Transaction(BaseModel):
    model_config = ConfigDict(extra='forbid')
    step: int = Field(ge=0)
    type: Literal['PAYMENT', 'TRANSFER', 'CASH_OUT', 'CASH_IN', 'DEBIT']
    amount: float = Field(ge=0)
    nameOrig: str = Field(min_length=1, max_length=255)
    oldbalanceOrg: float = Field(ge=0)
    newbalanceOrig: float = Field(ge=0)
    nameDest: str = Field(min_length=1, max_length=255)
    oldbalanceDest: float = Field(ge=0)
    newbalanceDest: float = Field(ge=0)
    isFlaggedFraud: Literal[0, 1]


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    model: Literal['logistic_regression', 'random_forest']
    transaction: Transaction


@asynccontextmanager
async def lifespan(app: FastAPI):
    registry.load()
    yield


app = FastAPI(title='Fraud Detection ML Inference Service', version='1.0.0', lifespan=lifespan)


@app.get('/health')
def health():
    models = registry.status()
    return {'status': 'healthy' if all(models.values()) else 'degraded', 'models': models}


@app.post('/predict')
def predict(request: PredictionRequest):
    if request.model not in registry.models:
        raise HTTPException(status_code=503, detail=f'Requested model is unavailable: {request.model}')
    try:
        return registry.predict(request.model, request.transaction.model_dump())
    except Exception as error:
        raise HTTPException(status_code=500, detail='Prediction failed') from error
