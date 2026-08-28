import React, { useState } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import Card, { CardHeader, CardContent } from "../common/Card";
import Button from "../common/Button";
import { testCsvFile } from "../../services/csvService";
import { MODEL_IDS } from "../../utils/constants";
import { formatNumber, formatPercentRaw } from "../../utils/formatters";

const MODEL_OPTIONS = [
  { id: MODEL_IDS.LOGISTIC_REGRESSION, label: "LogisticRegression" },
  { id: MODEL_IDS.RANDOM_FOREST, label: "RandomForestClassifier" },
];

export default function CsvModelTester() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState(MODEL_IDS.RANDOM_FOREST);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return setError("Choose a CSV file first.");
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await testCsvFile(file, model));
    } catch (requestError) {
      setError(requestError.message || "Could not test the CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Test a CSV file"
        subtitle="Run up to 500 PaySim rows through a saved model without adding them to prediction history"
      />
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-end">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            CSV file
            <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 font-mono font-normal text-slate-600 dark:text-slate-300">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
              <input type="file" accept=".csv,text/csv" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(null); setResult(null); }} className="min-w-0 w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-blue-600 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white" disabled={loading} />
            </span>
          </label>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Model
            <select value={model} onChange={(event) => setModel(event.target.value)} disabled={loading} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-100">
              {MODEL_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
          <Button type="submit" icon={Upload} loading={loading} disabled={!file || loading} className="h-10">
            {loading ? "Testing..." : "Test CSV"}
          </Button>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          Required columns: step, type, amount, nameOrig, oldbalanceOrg, newbalanceOrig, nameDest, oldbalanceDest, newbalanceDest, isFlaggedFraud.
        </p>

        {error && <div className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-700 dark:text-red-300"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

        {result && (
          <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[['Rows', result.totalRows], ['Processed', result.processedRows], ['Failed', result.failedRows], ['Fraud', result.results.filter((row) => row.prediction === 1).length]].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-2.5"><div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{label}</div><div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatNumber(value)}</div></div>
              ))}
            </div>
            {result.results.length > 0 && <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs font-mono"><thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500"><tr><th className="px-3 py-2">Row</th><th className="px-3 py-2">Prediction</th><th className="px-3 py-2">Probability</th><th className="px-3 py-2">Risk</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800"><>{result.results.slice(0, 100).map((row) => <tr key={row.row}><td className="px-3 py-2">{row.row}</td><td className={row.prediction === 1 ? "px-3 py-2 text-red-600" : "px-3 py-2 text-emerald-600"}>{row.predictionLabel}</td><td className="px-3 py-2">{formatPercentRaw(row.probabilityPercentage)}</td><td className="px-3 py-2">{row.riskLevel}</td></tr>)}</></tbody></table></div>}
            {result.errors.length > 0 && <div className="text-[11px] text-amber-700 dark:text-amber-300">{result.errors.slice(0, 5).map((item) => <div key={item.row}>Row {item.row}: {item.message}</div>)}</div>}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Batch test complete. Results were not saved to history.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
