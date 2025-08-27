import React from "react";

export const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${
        props.className || ""
      }`}
    >
      {children}
    </button>
  );
};
