import React, { useState } from "react";
import {
  Zap,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import Card, { CardHeader, CardContent } from "../common/Card";
import Button from "../common/Button";
import TransactionInput from "./TransactionInput";
import ModelSelector from "./ModelSelector";
import { TRANSACTION_TYPES, MODEL_IDS, PRESET_TRANSACTIONS } from "../../utils/constants";
import { validateTransactionInput } from "../../utils/validators";

const INITIAL_FORM_STATE = {
  type: "TRANSFER",
  amount: "181004.48",
  step: "1",
  oldbalanceOrg: "181004.48",
  newbalanceOrig: "0.00",
  oldbalanceDest: "0.00",
  newbalanceDest: "0.00",
  nameOrig: "C1231006815",
  nameDest: "C1979787155",
  isFlaggedFraud: "No",
};

export default function TransactionForm({
  onSubmit,
  loading = false,
  selectedModel = MODEL_IDS.COMPARE_BOTH,
  onSelectModel,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      type: preset.data.type,
      amount: String(preset.data.amount),
      step: String(preset.data.step),
      oldbalanceOrg: String(preset.data.oldbalanceOrg),
      newbalanceOrig: String(preset.data.newbalanceOrig),
      oldbalanceDest: String(preset.data.oldbalanceDest),
      newbalanceDest: String(preset.data.newbalanceDest),
      nameOrig: preset.data.nameOrig || "C123456789",
      nameDest: preset.data.nameDest || "C987654321",
      isFlaggedFraud: preset.data.isFlaggedFraud || "No",
    });
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      type: "TRANSFER",
      amount: "",
      step: "1",
      oldbalanceOrg: "",
      newbalanceOrig: "",
      oldbalanceDest: "",
      newbalanceDest: "",
      nameOrig: "",
      nameDest: "",
      isFlaggedFraud: "No",
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateTransactionInput(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSubmit(formData, selectedModel);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preset Demo Scenarios Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Bookmark className="w-3.5 h-3.5 text-blue-500" />
            <span>Research & Defense Demo Presets</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Load PaySim scenario
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_TRANSACTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-mono text-left"
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION A — TRANSACTION INFORMATION */}
      <Card>
        <CardHeader
          title="Section A — Transaction Information"
          subtitle="Core transaction metadata and volume parameters"
        />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Transaction Type */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="input-type"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-tight"
              >
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <select
                id="input-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
                className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Transaction Amount */}
            <TransactionInput
              label="Transaction Amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              prefix="$"
              placeholder="0.00"
              required
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              disabled={loading}
              helperText="Currency: USD"
            />

            {/* Transaction Step (Hour) */}
            <TransactionInput
              label="Transaction Step"
              name="step"
              type="number"
              step="1"
              min="1"
              suffix="hr"
              placeholder="1 to 744"
              required
              value={formData.step}
              onChange={handleChange}
              error={errors.step}
              disabled={loading}
              helperText="1 step = 1 hour (PaySim)"
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION B & C — ORIGIN & DESTINATION ACCOUNTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SECTION B — ORIGIN ACCOUNT */}
        <Card>
          <CardHeader
            title="Section B — Origin Account"
            subtitle="Customer sending or initiating funds"
          />
          <CardContent className="space-y-4">
            <TransactionInput
              label="Initial Balance (Old Balance)"
              name="oldbalanceOrg"
              type="number"
              step="0.01"
              min="0"
              prefix="$"
              placeholder="0.00"
              required
              value={formData.oldbalanceOrg}
              onChange={handleChange}
              error={errors.oldbalanceOrg}
              disabled={loading}
            />

            <TransactionInput
              label="Updated Balance (New Balance)"
              name="newbalanceOrig"
              type="number"
              step="0.01"
              min="0"
              prefix="$"
              placeholder="0.00"
              required
              value={formData.newbalanceOrig}
              onChange={handleChange}
              error={errors.newbalanceOrig}
              disabled={loading}
              helperText="Zeroed balance strongly indicates account drain"
            />
          </CardContent>
        </Card>

        {/* SECTION C — DESTINATION ACCOUNT */}
        <Card>
          <CardHeader
            title="Section C — Destination Account"
            subtitle="Recipient or merchant account"
          />
          <CardContent className="space-y-4">
            <TransactionInput
              label="Initial Balance (Old Balance)"
              name="oldbalanceDest"
              type="number"
              step="0.01"
              min="0"
              prefix="$"
              placeholder="0.00"
              required
              value={formData.oldbalanceDest}
              onChange={handleChange}
              error={errors.oldbalanceDest}
              disabled={loading}
            />

            <TransactionInput
              label="Updated Balance (New Balance)"
              name="newbalanceDest"
              type="number"
              step="0.01"
              min="0"
              prefix="$"
              placeholder="0.00"
              required
              value={formData.newbalanceDest}
              onChange={handleChange}
              error={errors.newbalanceDest}
              disabled={loading}
            />
          </CardContent>
        </Card>
      </div>

      {/* SECTION D — OPTIONAL INFORMATION */}
      <Card>
        <CardHeader
          title="Section D — Identifiers & Rules"
          subtitle="Account IDs and heuristic business rule flags"
        />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TransactionInput
              label="Origin Account ID"
              name="nameOrig"
              placeholder="e.g. C1231006815"
              value={formData.nameOrig}
              onChange={handleChange}
              disabled={loading}
              helperText="Customer starting transaction"
            />

            <TransactionInput
              label="Destination Account ID"
              name="nameDest"
              placeholder="e.g. C1979787155 / M..."
              value={formData.nameDest}
              onChange={handleChange}
              disabled={loading}
              helperText="C = Customer, M = Merchant"
            />

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="input-isFlaggedFraud"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-tight"
              >
                Flagged Fraud Indicator
              </label>
              <select
                id="input-isFlaggedFraud"
                name="isFlaggedFraud"
                value={formData.isFlaggedFraud}
                onChange={handleChange}
                disabled={loading}
                className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="No">No (Standard Rule)</option>
                <option value="Yes">Yes (&gt; $200,000 threshold flag)</option>
              </select>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Rule-based legacy system flag
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODEL SELECTION */}
      <Card>
        <CardContent className="pt-2">
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
            disabled={loading}
          />
        </CardContent>
      </Card>

      {/* SUBMISSION & ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="md"
          icon={RotateCcw}
          onClick={handleReset}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Reset Form
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={Zap}
          loading={loading}
          className="w-full sm:w-auto min-w-[220px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm"
          id="analyze-transaction-btn"
        >
          {loading ? "Analyzing Transaction..." : "Analyze Transaction"}
        </Button>
      </div>
    </form>
  );
}
