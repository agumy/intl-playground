import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { isValid } from "date-fns";

type Locale = "en-US" | "en-GB" | "ja-JP";

const GlobalStyle = createGlobalStyle`
html {
    height: 100%;
}

body {
    height: 100%;
    margin: 0;
}

#root {
    height: 100%;
    padding: 20px;
}
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  :not(:first-of-type) {
    margin-top: 20px;
  }
`;

const useDateTime = (
  initialDate = new Date()
): [string, Date, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [rawValue, setRawValue] = React.useState("");
  const [dateTime, setDateTime] = React.useState(initialDate);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRawValue(e.currentTarget.value);
      setDateTime(new Date(e.currentTarget.value));
    },
    [setRawValue]
  );

  return [rawValue, dateTime, handleChange];
};

const useLocale = (initialLocale: Locale = "en-US") => {
  const [locale, setLocale] = React.useState(initialLocale);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLocale(e.currentTarget.value as any);
    },
    [setLocale]
  );

  return [locale, setLocale];
};

const App: React.FC = () => {
  const [rawValue, dateTime, handleChange] = useDateTime();
  return (
    <>
      <GlobalStyle />
      <Center>
        <label>
          <span>YYYY-MM-DD hh:mm</span>
          <input value={rawValue} onChange={handleChange} />
        </label>
      </Center>
      <Center>
        <span>target date: {dateTime.toLocaleString()}</span>
      </Center>
      <Center>
        <label>
          <span>Locale</span>
          <select>
            <option value="en-US">en-US</option>
            <option value="en-GB">en-GB</option>
            <option value="ja-JP">ja-JP</option>
          </select>
        </label>
      </Center>
      <Center>
        <button onClick={() => {}} disabled={!isValid(dateTime)}>
          Output
        </button>
      </Center>
    </>
  );
};

export default App;
