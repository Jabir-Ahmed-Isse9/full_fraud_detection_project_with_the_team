import React from "react";
import Badge from "../common/Badge";

export default function PredictionStatus({ status, isFraud }) {
  if (isFraud || status?.toLowerCase().includes("flag") || status?.toLowerCase().includes("block")) {
    return (
      <Badge variant="danger" dot>
        {status || "Flagged & Blocked"}
      </Badge>
    );
  }
  if (status?.toLowerCase().includes("review") || status?.toLowerCase().includes("medium")) {
    return (
      <Badge variant="warning" dot>
        {status || "Manual Review"}
      </Badge>
    );
  }
  return (
    <Badge variant="success" dot>
      {status || "Approved"}
    </Badge>
  );
}
