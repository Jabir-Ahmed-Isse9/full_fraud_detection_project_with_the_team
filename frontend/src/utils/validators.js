/**
 * Input validators for transaction test form
 */

import { TRANSACTION_TYPES } from "./constants";

export const validateTransactionInput = (formData) => {
  const errors = {};

  // Transaction Type
  if (!formData.type || !TRANSACTION_TYPES.includes(formData.type)) {
    errors.type = "Please select a valid transaction type.";
  }

  // Amount validation
  if (
    formData.amount === "" ||
    formData.amount === undefined ||
    isNaN(Number(formData.amount))
  ) {
    errors.amount = "Transaction amount is required and must be a number.";
  } else if (Number(formData.amount) <= 0) {
    errors.amount = "Transaction amount must be strictly greater than $0.00.";
  }

  // Step validation
  if (
    formData.step === "" ||
    formData.step === undefined ||
    isNaN(Number(formData.step))
  ) {
    errors.step = "Transaction step (hour) is required.";
  } else if (Number(formData.step) < 1 || !Number.isInteger(Number(formData.step))) {
    errors.step = "Step must be a positive integer (e.g. 1 to 744).";
  }

  // Origin Old Balance
  if (
    formData.oldbalanceOrg === "" ||
    formData.oldbalanceOrg === undefined ||
    isNaN(Number(formData.oldbalanceOrg))
  ) {
    errors.oldbalanceOrg = "Initial origin balance is required.";
  } else if (Number(formData.oldbalanceOrg) < 0) {
    errors.oldbalanceOrg = "Balance cannot be negative.";
  }

  // Origin New Balance
  if (
    formData.newbalanceOrig === "" ||
    formData.newbalanceOrig === undefined ||
    isNaN(Number(formData.newbalanceOrig))
  ) {
    errors.newbalanceOrig = "Updated origin balance is required.";
  } else if (Number(formData.newbalanceOrig) < 0) {
    errors.newbalanceOrig = "Balance cannot be negative.";
  }

  // Destination Old Balance
  if (
    formData.oldbalanceDest === "" ||
    formData.oldbalanceDest === undefined ||
    isNaN(Number(formData.oldbalanceDest))
  ) {
    errors.oldbalanceDest = "Initial destination balance is required.";
  } else if (Number(formData.oldbalanceDest) < 0) {
    errors.oldbalanceDest = "Balance cannot be negative.";
  }

  // Destination New Balance
  if (
    formData.newbalanceDest === "" ||
    formData.newbalanceDest === undefined ||
    isNaN(Number(formData.newbalanceDest))
  ) {
    errors.newbalanceDest = "Updated destination balance is required.";
  } else if (Number(formData.newbalanceDest) < 0) {
    errors.newbalanceDest = "Balance cannot be negative.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
