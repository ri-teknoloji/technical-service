const BACKEND = import.meta.env.PROD ? "" : "http://localhost:8000";
const CDN = import.meta.env.CDN_URL || "https://onur-lib.aydinthefirst.com/";

const config = {
  BACKEND,
  CDN,
};

export default config;
