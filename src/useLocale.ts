import React from "react";

type Locale = "en-US" | "en-GB" | "ja-JP";

export const useLocale = (
  initialLocale: Locale = "ja-JP"
): [Locale, (e: React.ChangeEvent<HTMLSelectElement>) => void] => {
  const [locale, setLocale] = React.useState(initialLocale);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLocale(e.currentTarget.value as any);
    },
    [setLocale]
  );

  return [locale, handleChange];
};
