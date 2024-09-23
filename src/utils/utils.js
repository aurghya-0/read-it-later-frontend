import { randomBytes } from "crypto";

export const generateApiKey = () => {
  return randomBytes(16).toString("hex");
};
