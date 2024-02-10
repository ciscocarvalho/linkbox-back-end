import i18next, { InitOptions } from "i18next";
import { LanguageDetector } from "i18next-http-middleware";
import FsBackend, { FsBackendOptions } from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";
import fs from "fs";

const getNamespaces = () => {
  const localesPath = path.join(__dirname, "locales");
  const enLocalePath = path.join(localesPath, "en");
  const enLocaleDir = fs.readdirSync(enLocalePath);
  return enLocaleDir.map((fileName) => path.parse(fileName).name);
};

export default class I18n {
  static config = {
    fallbackLng: "en",
    debug: false,
    lowerCaseLng: true,
    // Without explicitely defining namespaces in config, the filesystem
    // backend doesn't work right.
    ns: getNamespaces(),
    defaultNS: "response_errors",
    keySeparator: ".",
    nsSeparator: ":",
    pluralSeparator: "-",
    contextSeparator: "-",
    detection: {
      order: ["cookie", "header"],
      lookupCookie: "language",
      caches: false,
      ignoreCase: true,
    },
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
      addPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.missing.json"),
    },
  } as const satisfies InitOptions<FsBackendOptions>;

  static init(config = this.config) {
    i18next.use(FsBackend).use(LanguageDetector).init(config);
  }

  static getMiddleware() {
    return i18nextMiddleware.handle(i18next);
  }
}
