import React from "react";

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
  minute: "none",
};

const selectOption = (key: keyof State, value: State[keyof State]) =>
  ({
    type: "SELECT_OPTION",
    payload: {
      key,
      value,
    },
  } as const);

const reducer = (state: State, action: ReturnType<typeof selectOption>) => {
  switch (action.type) {
    case "SELECT_OPTION":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      throw new Error();
  }
};

export const useDateTimeFormat = () => {
  const [options, dispatch] = React.useReducer(reducer, initialState);

  return [options, dispatch] as const;
};
