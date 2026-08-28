import React from "react";
import Card, { CardHeader, CardContent } from "../common/Card";

export default function DashboardCard({
  title,
  subtitle,
  action,
  children,
  className = "",
  contentClassName = "",
  id,
}) {
  return (
    <Card id={id} className={`flex flex-col h-full ${className}`}>
      {(title || subtitle || action) && (
        <CardHeader title={title} subtitle={subtitle} action={action} />
      )}
      <CardContent className={`flex-1 flex flex-col min-h-0 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
}
