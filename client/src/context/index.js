import React, { createContext, useReducer } from "react";
import initialState from "./initialState";
import mainReducer from "./reducers";

const AppContext = createContext({
  state: initialState,
  dispatch: () => {},
});

const AppContextProvider = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
