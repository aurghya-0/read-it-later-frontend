import { randomBytes } from "crypto";

export const formatDate = (isoDate) => {
  console.log(isoDate);
  const date = new Date(isoDate);
  const localeDate = date.toLocaleString("en-in");
  console.log(localeDate);
  return localeDate;
};

export const generateApiKey = () => {
  return randomBytes(16).toString("hex");
};
