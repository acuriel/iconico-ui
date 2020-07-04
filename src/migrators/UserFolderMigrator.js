import UserMigrator from "./UserMigrator";

class UserFolderMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      name: data.folderName,
      author: UserMigrator.loadFromResponse(data.author),
      isPinned: data.isPinned,
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      folderName: data.name,
      isPinned: data.isPinned,
    }
  }
  getNewFolder(name){
    return {
      folderName:name
    }
  }
}

export default new UserFolderMigrator();
