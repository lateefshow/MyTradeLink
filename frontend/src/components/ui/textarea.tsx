import React from "react";

export const Textarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => {
  return (
    <textarea
      {...props}
      className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        props.className || ""
      }`}
    />
  );
};
