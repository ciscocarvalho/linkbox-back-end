export function traversePath(path: any, folder: any) {
  if (path.length === 0) {
    return folder;
  }

  const folderDTO = folder.find((b: any) => b.name === path[0]);
  path.shift();
  return traversePath(path, folderDTO.folder);
}

export function traversePathLink(path: string[], folder: any) {
  if (path.length === 0) {
    return folder[0];
  }

  const folderDTO = folder.find((b: any) => b.name === path[0]);
  path.shift();
  return traversePath(path, folderDTO.folder);
}
