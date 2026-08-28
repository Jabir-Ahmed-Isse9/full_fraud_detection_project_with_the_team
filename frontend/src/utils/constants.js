/**
 * Constants for PaySim Fraud Detection Intelligence Platform
 */

export const APP_NAME = "PaySim Fraud Intelligence";
export const APP_VERSION = "v1.0.0";
export const SYSTEM_STATUS = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  DEGRADED: "DEGRADED",
};

export const TRANSACTION_TYPES = [
  "CASH_IN",
  "CASH_OUT",
  "DEBIT",
  "PAYMENT",
  "TRANSFER",
];

export const MODELS = {
  LOGISTIC_REGRESSION: "LogisticRegression",
  RANDOM_FOREST: "RandomForestClassifier",
  COMPARE_BOTH: "Compare Both Models",
};

export const MODEL_IDS = {
  LOGISTIC_REGRESSION: "logistic_regression",
  RANDOM_FOREST: "random_forest",
  COMPARE_BOTH: "compare_both",
};

export const RISK_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

export const RISK_THRESHOLDS = {
  LOW_MAX: 39,
  MEDIUM_MAX: 69,
  HIGH_MIN: 70,
};

export const PREDICTION_OUTCOMES = {
  LEGITIMATE: "LEGITIMATE TRANSACTION",
  FRAUDULENT: "FRAUDULENT TRANSACTION",
};

// Preset demo transactions for live presentations and defenses
export const PRESET_TRANSACTIONS = [
  {
    label: "High-Risk Flagged Transfer",
    description: "Large flagged transfer that fully drains the origin account; the saved Logistic Regression pipeline classifies this as high risk.",
    data: {
      type: "TRANSFER",
      amount: 10000000,
      step: 1,
      oldbalanceOrg: 10000000,
      newbalanceOrig: 0,
      oldbalanceDest: 0,
      newbalanceDest: 0,
      nameOrig: "C1231006815",
      nameDest: "C1979787155",
      isFlaggedFraud: "Yes",
    },
  },
  {
    label: "High-Risk Account Drain (Transfer)",
    description: "Entire balance transferred out with 0 remaining origin balance (Classic Fraud pattern)",
    data: {
      type: "TRANSFER",
      amount: 181004.48,
      step: 1,
      oldbalanceOrg: 181004.48,
      newbalanceOrig: 0.0,
      oldbalanceDest: 0.0,
      newbalanceDest: 0.0,
      nameOrig: "C1231006815",
      nameDest: "C1979787155",
      isFlaggedFraud: "No",
    },
  },
  {
    label: "Rapid Cash-Out Laundering",
    description: "Immediate cash-out of large incoming transfer with empty destination prior balance",
    data: {
      type: "CASH_OUT",
      amount: 181004.48,
      step: 1,
      oldbalanceOrg: 181004.48,
      newbalanceOrig: 0.0,
      oldbalanceDest: 21182.0,
      newbalanceDest: 202186.48,
      nameOrig: "C1979787155",
      nameDest: "C476402209",
      isFlaggedFraud: "No",
    },
  },
  {
    label: "Legitimate Routine Payment",
    description: "Small everyday merchant retail POS payment",
    data: {
      type: "PAYMENT",
      amount: 9839.64,
      step: 1,
      oldbalanceOrg: 170136.0,
      newbalanceOrig: 160296.36,
      oldbalanceDest: 0.0,
      newbalanceDest: 0.0,
      nameOrig: "C1231006815",
      nameDest: "M1979787155",
      isFlaggedFraud: "No",
    },
  },
  {
    label: "Standard Inbound Salary Deposit (Cash In)",
    description: "Authorized top-up/deposit with corresponding balance increase",
    data: {
      type: "CASH_IN",
      amount: 25000.0,
      step: 12,
      oldbalanceOrg: 54000.0,
      newbalanceOrig: 79000.0,
      oldbalanceDest: 320000.0,
      newbalanceDest: 295000.0,
      nameOrig: "C847291032",
      nameDest: "C392019482",
      isFlaggedFraud: "No",
    },
  },
  {
    label: "Ambiguous Large Transfer (Disagreement Case)",
    description: "Large transfer with partial balance depletion that triggers baseline uncertainty",
    data: {
      type: "TRANSFER",
      amount: 450000.0,
      step: 148,
      oldbalanceOrg: 890000.0,
      newbalanceOrig: 440000.0,
      oldbalanceDest: 120000.0,
      newbalanceDest: 570000.0,
      nameOrig: "C551928371",
      nameDest: "C998124018",
      isFlaggedFraud: "Yes",
    },
  },
];
