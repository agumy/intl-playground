import React from "react";

export const useDateTime = (initialDate = new Date()) => {
  const [rawValue, setRawValue] = React.useState(initialDate.toLocaleString());
  const [dateTime, setDateTime] = React.useState(initialDate);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRawValue(e.currentTarget.value);
      setDateTime(new Date(e.currentTarget.value));
    },
    [setRawValue]
  );

  return [rawValue, dateTime, handleChange] as const;
};
