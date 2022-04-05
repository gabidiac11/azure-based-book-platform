import initialState from "./initialState";

export const actionTypes = {
  Init: "Init",
  SetLanguage: "SetLanguage",
};

export default (state, action) => {
  switch (action.type) {
    case actionTypes.Init:
      return {
        ...initialState,
        ...action.payload,
      };
    case actionTypes.SetLanguage:
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};
