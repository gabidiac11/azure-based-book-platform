export const STAGE = process.env.REACT_APP_STAGE;

const LIVE = "https://cc-2022-app-service.azurewebsites.net/api/";
const LOCAL = "http://localhost:5001/api/";

export const BASE_URL = (() => {
  switch (STAGE) {
    case "local":
      return LOCAL;

    case "dev":
      return LIVE;

    default:
      return LIVE;
  }
})();
