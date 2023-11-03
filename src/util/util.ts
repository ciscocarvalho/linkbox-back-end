export function percorrerPath(path, folder) {
  if (path.length === 0) {
    return folder;
  }
  const folderDTO = folder.find((b) => b.name === path[0]);
  path.shift();
  return percorrerPath(path, folderDTO.folder);
}

export function percorrerPathLink(path, folder) {
  if (path.length === 0) {
    return folder;
  }
  const folderDTO = folder.find((b) => b.name === path[0]);
  path.shift();
  return percorrerPath(path, folderDTO);
}
