from pathlib import Path
from typing import Any

import joblib
import pandas as pd

FEATURE_COLUMNS = [
    'step', 'type', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig',
    'nameDest', 'oldbalanceDest', 'newbalanceDest', 'isFlaggedFraud',
]
MODEL_FILES = {
    'logistic_regression': 'logistic_model_for_fraud_detection.joblib',
    'random_forest': 'random_forest_model_for_fraud_detection.joblib',
}


class ModelRegistry:
    """Loads trained sklearn pipelines once, when the service starts."""

    def __init__(self, model_dir: Path):
        self.model_dir = model_dir
        self.models: dict[str, Any] = {}
        self.errors: dict[str, str] = {}

    def load(self) -> None:
        for name, filename in MODEL_FILES.items():
            try:
                self.models[name] = joblib.load(self.model_dir / filename)
            except Exception as error:  # Health endpoint exposes only the safe status.
                self.errors[name] = str(error)

    def status(self) -> dict[str, bool]:
        return {name: name in self.models for name in MODEL_FILES}

    def predict(self, model_name: str, transaction: dict[str, Any]) -> dict[str, Any]:
        model = self.models.get(model_name)
        if model is None:
            raise RuntimeError(f'Model {model_name} is not loaded')

        # The loaded sklearn Pipeline owns all encoding and scaling.  Sending this
        # DataFrame directly prevents training/inference preprocessing drift.
        frame = pd.DataFrame([{column: transaction[column] for column in FEATURE_COLUMNS}], columns=FEATURE_COLUMNS)
        frame = frame.astype({
            'step': 'int64', 'amount': 'float64', 'oldbalanceOrg': 'float64',
            'newbalanceOrig': 'float64', 'oldbalanceDest': 'float64',
            'newbalanceDest': 'float64', 'isFlaggedFraud': 'int64',
            'type': 'string', 'nameOrig': 'string', 'nameDest': 'string',
        })
        prediction = int(model.predict(frame)[0])
        if not hasattr(model, 'predict_proba'):
            raise RuntimeError('Loaded model does not support predict_proba')
        probabilities = model.predict_proba(frame)[0]
        classes = list(getattr(model, 'classes_', []))
        if 1 not in classes:
            raise RuntimeError('Loaded model does not expose fraud class 1')
        fraud_probability = float(probabilities[classes.index(1)])
        return {'prediction': prediction, 'probability': fraud_probability, 'model': model_name}
