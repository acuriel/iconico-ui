import UserMigrator from "./UserMigrator";

class FeedMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      title: data.tittle,
      summary: data.summary,
      author: UserMigrator.loadFromResponse(data.author),
      imageData: data.imageData,
      imageMimeType: data.imageMimeType,
      createdAt: new Date(data.issuedOn),
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      tittle: data.title,
      summary: data.summary,
    }
  }
}

export default new FeedMigrator();
