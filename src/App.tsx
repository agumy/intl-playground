import React, { useEffect } from "react";
import styled from "styled-components";
import { Radio, RadioGroup } from "react-radios";
import { isValid } from "date-fns";

type Locale = "en-US" | "en-GB" | "ja-JP";

type FormatedDate = {
  date: string;
  align: "flex-start" | "center" | "flex-end";
};

const useDateTime = (
  initialDate = new Date()
): [string, Date, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [rawValue, setRawValue] = React.useState(initialDate.toLocaleString());
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

type State = {
  hourCycle: "h12" | "h24";
  weekday: "long" | "short" | "narrow" | "none";
  year: "numeric" | "2-digit" | "none";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow" | "none";
  day: "numeric" | "2-digit" | "none";
  hour: "numeric" | "2-digit" | "none";
  minute: "numeric" | "2-digit" | "none";
};

const initialState: State = {
  hourCycle: "h24",
  weekday: "none",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "none",
  minute: "none"
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;

  :not(:first-of-type) {
    margin-top: 8px;
  }
`;

const ItemName = styled.span`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
`;

const Options = styled.div`
  display: flex;
  margin-left: 16px;
`;

const Button = styled.button`
  margin-left: 4px;
`;

const Preview = styled.div`
  background: #f7f7f7;
  padding: 10px;
  overflow-y: scroll;
`;

const PreviewItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const PreviewDate = styled.span<{ align: FormatedDate["align"] }>`
  width: 100%;
  display: flex;
  justify-content: ${props => props.align};
  flex: 4;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-left: 8px;
  flex: 1;
`;

const App: React.FC = () => {
  const [rawValue, dateTime, handleChange] = useDateTime();
  const [locale, setLocale] = useLocale();
  const [options, dispatch] = React.useReducer(reducer, initialState);
  const [dateList, setDateList] = React.useState<FormatedDate[]>([]);

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
    const next: FormatedDate = {
      date: formatter.format(dateTime),
      align: "flex-start"
    };
    setDateList(state => [...state, next]);
  }, [locale, dateTime, options]);

  const enter = React.useCallback(
    (e: KeyboardEvent) => {
      if (
        e.code === "Enter" &&
        isValid(dateTime) &&
        (document.activeElement as Element).tagName !== "BUTTON"
      ) {
        format();
      }
    },
    [dateTime, format]
  );

  useEffect(() => {
    window.addEventListener("keydown", enter);
    return () => {
      window.removeEventListener("keydown", enter);
    };
  }, [enter]);

  const onChangeOption = React.useCallback(
    (key: keyof State) => (value: State[keyof State]) => {
      dispatch(selectOption(key, value));
    },
    [dispatch]
  );

  const onFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  }, []);

  const onClickAlign = React.useCallback(
    (rowNum: number, align: FormatedDate["align"]) => {
      setDateList(state =>
        state.map((e, i) => {
          if (i === rowNum) {
            return {
              ...e,
              align
            };
          }
          return e;
        })
      );
    },
    [setDateList]
  );

  const onClickDelete = React.useCallback((rowNum: number) => {
    setDateList(state => state.filter((_e, i) => rowNum !== i));
  }, []);

  return (
    <GridContainer>
      <div>
        <Item>
          <ItemName>
            <span>YYYY-MM-DD hh:mm </span>
          </ItemName>
          <Options>
            <input
              style={{ lineHeight: "18px", fontSize: "16px", width: "50%" }}
              value={rawValue}
              onChange={handleChange}
              onFocus={onFocus}
            />
          </Options>
        </Item>
        <Item>
          <ItemName>Target Date Time</ItemName>
          <Options>{dateTime.toLocaleString()}</Options>
        </Item>
        <Item>
          <ItemName>Locale</ItemName>
          <Options>
            <select value={locale} onChange={setLocale}>
              <option value="ja-JP">ja-JP</option>
              <option value="en-GB">en-GB</option>
              <option value="en-US">en-US</option>
            </select>
          </Options>
        </Item>
        <Item>
          <ItemName>year</ItemName>
          <Options>
            <RadioGroup value={options.year} onChange={onChangeOption("year")}>
              <label>
                <Radio value="none" /> none
              </label>
              <label>
                <Radio value="numeric" /> numeric
              </label>
              <label>
                <Radio value="2-digit" /> 2-digit
              </label>
            </RadioGroup>
          </Options>
        </Item>
        <Item>
          <ItemName>month</ItemName>
          <Options>
            <RadioGroup
              value={options.month}
              onChange={onChangeOption("month")}
            >
              <label>
                <Radio value="none" /> none
              </label>
              <label>
                <Radio value="numeric" /> numeric
              </label>
              <label>
                <Radio value="2-digit" /> 2-digit
              </label>
              <label>
                <Radio value="long" /> long
              </label>
              <label>
                <Radio value="short" /> short
              </label>
              <label>
                <Radio value="narrow" /> narrow
              </label>
            </RadioGroup>
          </Options>
        </Item>
        <Item>
          <ItemName>day</ItemName>
          <Options>
            <RadioGroup value={options.day} onChange={onChangeOption("day")}>
              <label>
                <Radio value="none" /> none
              </label>
              <label>
                <Radio value="numeric" /> numeric
              </label>
              <label>
                <Radio value="2-digit" /> 2-digit
              </label>
            </RadioGroup>
          </Options>
        </Item>
        <Item>
          <ItemName>weekday</ItemName>
          <Options>
            <RadioGroup
              value={options.weekday}
              onChange={onChangeOption("weekday")}
            >
              <label>
                <Radio value="none" /> none
              </label>
              <label>
                <Radio value="long" /> long
              </label>
              <label>
                <Radio value="short" /> short
              </label>
              <label>
                <Radio value="narrow" /> narrow
              </label>
            </RadioGroup>
          </Options>
        </Item>
        <Item>
          <ItemName>hour</ItemName>
          <Options>
            <RadioGroup value={options.hour} onChange={onChangeOption("hour")}>
              <label>
                <Radio value="none" /> none
              </label>
              <label>
                <Radio value="numeric" /> numeric
              </label>
              <label>
                <Radio value="2-digit" /> 2-digit
              </label>
            </RadioGroup>
          </Options>
        </Item>
        <Item>
          <ItemName>minute</ItemName>
          <Options>
            <RadioGroup
              value={options.minute}
              onChange={onChangeOption("minute")}
            >
              <label>
                <Radio value="none" /> none
              </label>
              <label>
                <Radio value="numeric" /> numeric
              </label>
              <label>
                <Radio value="2-digit" /> 2-digit
              </label>
            </RadioGroup>
          </Options>
        </Item>
        <Item>
          <ItemName>hourCycle</ItemName>
          <Options>
            <RadioGroup
              value={options.hourCycle}
              onChange={onChangeOption("hourCycle")}
            >
              <label>
                <Radio value="h24" /> h24
              </label>
              <label>
                <Radio value="h12" /> h12
              </label>
            </RadioGroup>
          </Options>
        </Item>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "16px"
          }}
        >
          <button onClick={format} disabled={!isValid(dateTime)}>
            Output (Enter)
          </button>
        </div>
      </div>
      <Preview>
        {dateList.map((e, i) => (
          <PreviewItem key={i}>
            <PreviewDate align={e.align}>{e.date}</PreviewDate>
            <Buttons>
              <Button onClick={() => onClickAlign(i, "flex-start")}>
                Left
              </Button>
              <Button onClick={() => onClickAlign(i, "center")}>Center</Button>
              <Button onClick={() => onClickAlign(i, "flex-end")}>Right</Button>
              <Button onClick={() => onClickDelete(i)}>Delete</Button>
            </Buttons>
          </PreviewItem>
        ))}
      </Preview>
    </GridContainer>
  );
};

export default App;
