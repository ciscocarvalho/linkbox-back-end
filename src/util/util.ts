import { IFolder } from "../Model/Folder";

export default function percorrerPath(path, folder){
    if(path.length === 0){
        return folder;
    }
    const folderDTO: IFolder = folder.find(b => b.name === path[0])
    path.shift()
    return percorrerPath(path, folderDTO.folder)
}