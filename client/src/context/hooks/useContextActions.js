import { useContext } from "react";
import { AppContext } from "..";
import { actionTypes } from "../reducers";

export const useContextActions = () => {
  const { dispatch } = useContext(AppContext);

  const updateLanguage = (language) => {
    dispatch({
      type: actionTypes.SetLanguage,
      payload: language,
    });
  };

  return {
    updateLanguage,
  };
};
