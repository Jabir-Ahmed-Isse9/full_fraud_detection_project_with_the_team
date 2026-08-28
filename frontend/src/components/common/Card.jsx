import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "p-5",
  onClick,
  id,
  ...props
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs transition-all duration-200 text-slate-900 dark:text-slate-100",
        hover && "hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md cursor-pointer",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", title, subtitle, action }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80", className)}>
      <div>
        {title && <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={cn("pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}
