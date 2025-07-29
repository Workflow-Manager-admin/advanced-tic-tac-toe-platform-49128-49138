import React from "react";
import classNames from "classnames";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

// PUBLIC_INTERFACE
export default function Input({ label, error, containerClassName, ...props }: Props) {
  return (
    <div className={classNames("mb-4 w-full", containerClassName)}>
      <label className="block text-sm font-medium mb-1 text-primary">{label}</label>
      <input
        className={classNames(
          "w-full px-3 py-2 border rounded transition placeholder-gray-400 text-dark bg-light focus:outline-none focus:border-primary",
          error && "border-red-500"
        )}
        {...props}
      />
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
}
