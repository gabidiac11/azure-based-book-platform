export const STAGE = process.env.REACT_APP_STAGE;

const LIVE = "https://cloud-computing-2022-345016.ew.r.appspot.com/api/";
const LOCAL = "http://localhost:5001/api/";
const STAGGING =
  "https://8080-0d6a9f5b-b557-4d26-a886-903b320a9fc0.cs-europe-west4-fycr.cloudshell.dev/api/";

export const BASE_URL = (() => {
  switch (STAGE) {
    case "local":
      return LOCAL;

    case "dev":
      return LIVE;

    case "live":
      return LIVE;

    default:
      return STAGGING;
  }
})();
