import { LINK_TITLE_IS_REQUIRED, LINK_URL_IS_REQUIRED } from "../../constants/responseErrors";
import { ILink } from "../../models/User";
import { betterAssign } from "../betterAssign";

export class LinkValidator {
  static validateCreation(link: ILink) {
    return this.validate(link);
  }

  static validateUpdate(link: ILink, linkCandidate: Partial<ILink>) {
    const updatedLink = betterAssign({ ...link }, { ...linkCandidate }) as ILink;
    const result = this.validate(updatedLink);

    return {
      ...result,
      data: result.errors ? undefined : { updatedLink },
    };
  }

  private static validate(link: ILink) {
    const errors = [];

    if (!link.url) {
      errors.push(LINK_URL_IS_REQUIRED);
    }

    if (!link.title) {
      errors.push(LINK_TITLE_IS_REQUIRED);
    }

    return { errors: errors.length === 0 ? undefined : errors };
  }
}
