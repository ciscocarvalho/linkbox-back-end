import { ObjectId } from "mongodb";
import { ILink } from "../../models/User";
import { CommonSanitizer } from "./CommonSanitizer";

export class LinkSanitizer {
  static sanitizeCreation(linkCandidate: Partial<ILink>) {
    linkCandidate = this.sanitize(linkCandidate);
    linkCandidate._id = new ObjectId().toString();
    return linkCandidate;
  }

  static sanitizeUpdate(linkData: Partial<ILink>) {
    return this.sanitize(linkData);
  }

  private static sanitize(linkData: Partial<ILink>) {
    linkData = { ...linkData };
    linkData = this.sanitizeUrlAndTitle(linkData);
    linkData = this.filterFields(linkData);
    return linkData;
  }

  private static sanitizeUrlAndTitle(linkData: Partial<ILink>) {
    linkData = { ...linkData };

    (["url", "title"] as const).forEach((field) => {
      linkData[field] = CommonSanitizer.sanitizeString(linkData[field]);
    });

    return linkData;
  }

  private static filterFields<T extends Partial<ILink>>(link: T): T {
    return {
      title: link.title,
      url: link.url,
      description: link.description,
      color: link.color,
      image: link.image,
      _id: link._id,
    } as T;
  }
}
