export class CommonSanitizer {
  static sanitizeString(value: any) {
    if (value === undefined) {
      value = "";
    } else if (typeof value === "string") {
      value = value.trim();
    }

    return value;
  }
}
