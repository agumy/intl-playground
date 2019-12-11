import React from "react";
import styled, { createGlobalStyle } from "styled-components";
// import { Radio, RadioGroup } from 'react-radios';
import { isValid } from "date-fns";

const Radios = require("react-radios");

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

const useLocale = (
  initialLocale: Locale = "en-US"
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

type State = {
  // hourCycle: "h12" | "h24" | "";
  weekday: "long" | "short" | "narrow" | "none";
  year: "numeric" | "2-digit" | "none";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow" | "none";
  day: "numeric" | "2-digit" | "none";
};

const initialState: State = {
  // hourCycle: "h24",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "2-digit"
};

const selectOption = (key: keyof State, value: State[keyof State]) =>
  ({
    type: "SELECT_OPTION",
    payload: {
      key,
      value
    }
  } as const);

const reducer = (state: State, action: ReturnType<typeof selectOption>) => {
  switch (action.type) {
    case "SELECT_OPTION":
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    default:
      throw new Error();
  }
};

const App: React.FC = () => {
  const [rawValue, dateTime, handleChange] = useDateTime();
  const [locale, setLocale] = useLocale();
  const [formatted, setFormatted] = React.useState(
    new Date().toLocaleDateString()
  );
  const [options, dispatch] = React.useReducer(reducer, initialState);

  const format = React.useCallback(() => {
    let filteredOptions = {};
    for (const [key, val] of Object.entries(options)) {
      if (val !== "none") {
        filteredOptions = {
          ...filteredOptions,
          [key]: val
        };
      }
    }

    const formatter = new Intl.DateTimeFormat(locale, filteredOptions);
    setFormatted(formatter.format(dateTime));
  }, [locale, dateTime, options]);

  const onChangeOption = React.useCallback(
    (key: keyof State) => (value: State[keyof State]) => {
      dispatch(selectOption(key, value));
    },
    [dispatch]
  );
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
        <span>target date: {dateTime.toLocaleDateString()}</span>
      </Center>
      <Center>
        <span>{formatted}</span>
      </Center>
      <Center>
        <button onClick={format} disabled={!isValid(dateTime)}>
          Output
        </button>
      </Center>
      <Center>
        <label>
          <span>Locale: </span>
          <select value={locale} onChange={setLocale}>
            <option value="en-US">en-US</option>
            <option value="en-GB">en-GB</option>
            <option value="ja-JP">ja-JP</option>
          </select>
        </label>
      </Center>
      {/* <Center>
        <label>
          <span>hourCycle: </span>
          <Radios.RadioGroup
            value={options.hourCycle}
            onChange={onChangeOption("hourCycle")}
          >
            <Radios.Radio value="h12" /> h12
            <Radios.Radio value="h24" /> h24
          </Radios.RadioGroup>
        </label>
      </Center> */}
      <Center>
        <span>weekday: </span>
        <Radios.RadioGroup
          value={options.weekday}
          onChange={onChangeOption("weekday")}
        >
          <label>
            <Radios.Radio value="none" /> none
          </label>
          <label>
            <Radios.Radio value="long" /> long
          </label>
          <label>
            <Radios.Radio value="short" /> short
          </label>
          <label>
            <Radios.Radio value="narrow" /> narrow
          </label>
        </Radios.RadioGroup>
      </Center>
      <Center>
        <span>year: </span>
        <Radios.RadioGroup
          value={options.year}
          onChange={onChangeOption("year")}
        >
          <Radios.Radio value="none" /> none
          <Radios.Radio value="numeric" /> numeric
          <Radios.Radio value="2-digit" /> 2-digit
        </Radios.RadioGroup>
      </Center>
      <Center>
        <span>month: </span>
        <Radios.RadioGroup
          value={options.month}
          onChange={onChangeOption("month")}
        >
          <Radios.Radio value="none" /> none
          <Radios.Radio value="numeric" /> numeric
          <Radios.Radio value="2-digit" /> 2-digit
          <Radios.Radio value="long" /> long
          <Radios.Radio value="short" /> short
          <Radios.Radio value="narrow" /> narrow
        </Radios.RadioGroup>
      </Center>
      <Center>
        <span>day: </span>
        <Radios.RadioGroup value={options.day} onChange={onChangeOption("day")}>
          <Radios.Radio value="none" /> none
          <Radios.Radio value="numeric" /> numeric
          <Radios.Radio value="2-digit" /> 2-digit
        </Radios.RadioGroup>
      </Center>
    </>
  );
};

export default App;
