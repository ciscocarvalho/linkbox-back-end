import { Request } from "express";

export type FolderRequest = Request & {
  params: [string | undefined],
}

export const getFolderDataFromRequest = (req: FolderRequest) => {
  const userId = req.session!.userId!;
  const { dashboardName } = req.params;
  const path = req.params[0];

  return { userId, dashboardName, path };
}
