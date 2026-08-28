const mlService = require('./mlService');

const TRANSACTION_TYPES = new Set(['PAYMENT', 'TRANSFER', 'CASH_OUT', 'CASH_IN', 'DEBIT']);
const REQUIRED_COLUMNS = [
  'step', 'type', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig',
  'nameDest', 'oldbalanceDest', 'newbalanceDest', 'isFlaggedFraud',
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { value += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(value); value = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(value); value = '';
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
    } else value += char;
  }
  if (value.length || row.length) { row.push(value); rows.push(row); }
  return rows;
}

function number(value, field, rowNumber, { integer = false } = {}) {
  const parsed = Number(String(value).trim());
  if (!Number.isFinite(parsed) || (integer && !Number.isInteger(parsed)) || parsed < 0) {
    throw new Error(`Row ${rowNumber}: ${field} must be a non-negative number`);
  }
  return parsed;
}

function transactionFromRow(row, headers, rowNumber) {
  const values = Object.fromEntries(headers.map((header, index) => [header, String(row[index] ?? '').trim()]));
  const type = values.type.toUpperCase();
  if (!TRANSACTION_TYPES.has(type)) throw new Error(`Row ${rowNumber}: unsupported transaction type`);
  if (!values.nameOrig || !values.nameDest) throw new Error(`Row ${rowNumber}: nameOrig and nameDest are required`);
  const flag = number(values.isFlaggedFraud, 'isFlaggedFraud', rowNumber, { integer: true });
  if (![0, 1].includes(flag)) throw new Error(`Row ${rowNumber}: isFlaggedFraud must be 0 or 1`);
  return {
    step: number(values.step, 'step', rowNumber, { integer: true }), type,
    amount: number(values.amount, 'amount', rowNumber), nameOrig: values.nameOrig,
    oldbalanceOrg: number(values.oldbalanceOrg, 'oldbalanceOrg', rowNumber),
    newbalanceOrig: number(values.newbalanceOrig, 'newbalanceOrig', rowNumber),
    nameDest: values.nameDest,
    oldbalanceDest: number(values.oldbalanceDest, 'oldbalanceDest', rowNumber),
    newbalanceDest: number(values.newbalanceDest, 'newbalanceDest', rowNumber),
    isFlaggedFraud: flag,
  };
}

function riskLevel(probability) {
  if (probability >= 0.7) return 'High';
  if (probability >= 0.4) return 'Medium';
  return 'Low';
}

async function predictCsv(csvText, model, maxRows = 500) {
  if (!['logistic_regression', 'random_forest'].includes(model)) {
    const error = new Error('model must be logistic_regression or random_forest');
    error.statusCode = 422;
    throw error;
  }
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    const error = new Error('CSV must contain a header row and at least one data row');
    error.statusCode = 422;
    throw error;
  }
  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, '').trim());
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missing.length) {
    const error = new Error(`CSV is missing required columns: ${missing.join(', ')}`);
    error.statusCode = 422;
    throw error;
  }
  if (rows.length - 1 > maxRows) {
    const error = new Error(`CSV contains ${rows.length - 1} rows; maximum is ${maxRows}`);
    error.statusCode = 413;
    throw error;
  }

  const results = [];
  const errors = [];
  for (let index = 1; index < rows.length; index += 1) {
    const rowNumber = index + 1;
    try {
      const transaction = transactionFromRow(rows[index], headers, rowNumber);
      const startedAt = Date.now();
      const prediction = await mlService.predict(model, transaction);
      const probability = Number(prediction.probability);
      const classification = Number(prediction.prediction);
      if (![0, 1].includes(classification) || !Number.isFinite(probability) || probability < 0 || probability > 1) {
        throw new Error('ML service returned an invalid prediction');
      }
      results.push({ row: rowNumber, prediction: classification, predictionLabel: classification === 1 ? 'Fraud' : 'Not Fraud', probability, probabilityPercentage: Number((probability * 100).toFixed(2)), riskLevel: riskLevel(probability), modelUsed: model, processingTime: Date.now() - startedAt, transaction });
    } catch (error) {
      errors.push({ row: rowNumber, message: error.message });
    }
  }
  return { model, totalRows: rows.length - 1, processedRows: results.length, failedRows: errors.length, results, errors, savedToHistory: false };
}

module.exports = { predictCsv, parseCsv, REQUIRED_COLUMNS };
