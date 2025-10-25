import { includes } from "lodash";
import config from "./configs.json";

export { default as yup } from "./yup.json";

const hostName = window.location.hostname;

const hostsProduction = ["admin.servitec-peru.com"];

export const currentEnvironment = includes(hostsProduction, hostName)
  ? "production"
  : "development";

export const isProduction = currentEnvironment === "production";
export const currentConfig = config[currentEnvironment];
