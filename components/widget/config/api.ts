let apiUrl;

if (process.env.REACT_APP_EFFEKT_API_URL) {
  apiUrl = process.env.REACT_APP_EFFEKT_API_URL;
} else {
  apiUrl = "https://dev.data.gieffektivt.no";
}

export const API_URL = apiUrl;
