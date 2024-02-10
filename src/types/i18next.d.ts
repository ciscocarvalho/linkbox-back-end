import "i18next";
import I18n from "../i18n";
import resources from "../i18n/resources";

type config = (typeof I18n)["config"];

declare module "i18next" {
  interface CustomTypeOptions extends config {
    resources: typeof resources;
  }
}

// FIX: Declaration file non-exported types are importable
// https://github.com/microsoft/TypeScript/issues/38592
export {};
