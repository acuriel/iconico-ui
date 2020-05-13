import UserMigrator from "./UserMigrator";

class UserFolderMigrator{
  loadFromResponse(data) {
    return {
      id: data._id, 
      name: data.FolderName, 
      author: UserMigrator.loadFromResponse(data.Author)
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      FolderName: data.name,
      Author: UserMigrator.saveForRequest(data.author)
    }
  }
}

export default new UserFolderMigrator();
