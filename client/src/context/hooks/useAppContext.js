import { useContext } from "react";
import { AppContext } from "..";

export const useAppContext = () => {
  return useContext(AppContext).state;
};
