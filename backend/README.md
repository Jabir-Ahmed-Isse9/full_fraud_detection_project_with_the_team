# Fraud Detection Backend

Production-oriented backend for the Fraud Detection React application. It uses an Express API for validation, history, dashboards, and MongoDB persistence; a FastAPI service runs the existing trained sklearn pipelines.

## Architecture

```text
React frontend → Express API → FastAPI ML service → loaded Joblib Pipeline
                    ↓
                 MongoDB predictions history
```

The Node API **never encodes or scales features**. The Python service creates a DataFrame with the original training columns and sends it directly to the saved pipeline, which preserves the trained `OneHotEncoder` and `StandardScaler` preprocessing.

## Setup

1. In `backend`, copy `.env.example` to `.env` and set the MongoDB connection and frontend URL.
2. The model files must be stored in `ml-service/models/` with these exact names:
   - `logistic_model_for_fraud_detection.joblib`
   - `random_forest_model_for_fraud_detection.joblib`
3. Install and run the API:

```bash
npm install
npm run dev
```

4. In a second terminal, start the inference service:

```bash
cd ml-service
python -m pip install -r requirements.txt
   python run_service.py
```

5. Start MongoDB locally (or provide an Atlas `MONGODB_URI`) and start the React application as usual.

## Environment variables

| Name | Purpose |
| --- | --- |
| `PORT` | Express port, default `5000` |
| `MONGODB_URI` | MongoDB database connection string |
| `ML_SERVICE_URL` | FastAPI base URL, default `http://localhost:8000` |
| `CLIENT_URL` | Allowed frontend origin |
| `MODEL_METRICS` | JSON object containing actual held-out model metrics |

`MODEL_METRICS` is deliberately configuration-driven. The provided example contains the evaluation results supplied with this project; replace them whenever you re-evaluate the real models.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Backend, database, and ML connectivity |
| GET | `/api/ml/health` | Joblib model load status |
| POST | `/api/predictions` | Predict and persist a transaction |
| POST | `/api/predictions/csv?model=random_forest` | Test up to 500 CSV rows without saving them to history |
| GET | `/api/predictions` | Paginated/filterable prediction history |
| GET | `/api/predictions/:id` | One prediction record |
| DELETE | `/api/predictions/:id` | Delete one history item |
| GET | `/api/dashboard/summary` | Dashboard totals |
| GET | `/api/dashboard/charts` | Chart-ready aggregate arrays |
| GET | `/api/dashboard/models` | Configured actual evaluation metrics |
| GET | `/api/analytics/dashboard` | Central MongoDB-backed dashboard analytics |
| GET | `/api/analytics/dataset` | Dataset analytics for saved predictions |
| GET | `/api/analytics/risk` | Risk distribution |
| GET | `/api/analytics/transaction-types` | Transaction type aggregation |
| GET | `/api/analytics/amount-tiers` | Amount tier aggregation |
| GET | `/api/models/performance` | Held-out model evaluation metrics |

## Create a prediction

```bash
curl -X POST http://localhost:5000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{"step":1,"type":"TRANSFER","amount":181,"nameOrig":"C1305486145","oldbalanceOrg":181,"newbalanceOrig":0,"nameDest":"C553264065","oldbalanceDest":0,"newbalanceDest":0,"isFlaggedFraud":0,"model":"random_forest"}'
```

The response contains `prediction` (the model result), `probability` (fraud-class probability), and `riskLevel` (a separate UI category: low below 40%, medium below 70%, high at or above 70%). Every successful result is stored in `predictions`; a database write failure is returned as an error and is never reported as a saved prediction.

## Test a CSV file

Send a `multipart/form-data` request with the CSV in a field named `file`. The file is limited to 5 MB and 500 data rows. It must include these columns: `step`, `type`, `amount`, `nameOrig`, `oldbalanceOrg`, `newbalanceOrig`, `nameDest`, `oldbalanceDest`, `newbalanceDest`, and `isFlaggedFraud`. Additional columns (such as the PaySim `isFraud` label) are ignored. Batch results are returned for review and are not written to prediction history.

```bash
curl -X POST "http://localhost:5000/api/predictions/csv?model=random_forest" \
  -F "file=@transactions.csv"
```

## History filtering

`GET /api/predictions?page=1&limit=20&model=random_forest&prediction=1&riskLevel=High&type=TRANSFER&startDate=2026-08-01&endDate=2026-08-31&search=C130`

The maximum page size is 100. Search only matches `nameOrig` and `nameDest` using escaped regular expressions. History is sorted newest first.

## Testing

```bash
npm test
```

The Jest/Supertest suite covers prediction validation, an unavailable ML service, pagination, invalid IDs, deletion, dashboard endpoints, and metrics. It mocks the ML/database service boundary so no model retraining or production database is involved.

## Deployment notes

- Keep `.env` and `ml-service/models/*.joblib` out of source control.
- Run the Node service, FastAPI service, and MongoDB as separately monitored services.
- Restrict `CLIENT_URL` to the deployed frontend origin.
- The FastAPI service loads models once during its lifespan startup; it does not load data, train models, or refit preprocessing during requests.
