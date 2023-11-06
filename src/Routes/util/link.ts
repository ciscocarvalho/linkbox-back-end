import { Request } from "express";

export type LinkRequest = Request & {
  params: [string | undefined],
}

export const getLinkDataFromRequest = (req: LinkRequest) => {
    // using req.path gives us the whole path (including the dashboard name),
    // it is better than req.params[0] for links because it gives the path as
    // is, whilst using req.params[0] gives us an already decoded url, which
    // makes problematic to parse the location because of slash separators coming
    // from the link url.
    const wholePath = req.path.substring(1);
    const userId = req.session!.userId!;
    const dashboardName = wholePath.split("/")[0];
    const path = wholePath.split("/").slice(1).join("/");

    return { userId, dashboardName, path };
}
