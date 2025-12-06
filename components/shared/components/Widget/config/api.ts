let apiUrl;

if (process.env.NEXT_PUBLIC_EFFEKT_API) {
  apiUrl = process.env.NEXT_PUBLIC_EFFEKT_API;
} else {
  apiUrl = "https://dev.data.gieffektivt.no";
}

export const API_URL = apiUrl;
export const WEBSOCKET_URL = apiUrl.replace(/^http/, "ws");
