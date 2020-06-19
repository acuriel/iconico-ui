import UserMigrator from "./UserMigrator";

class FeedMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      title: data.Tittle,
      summary: data.Summary,
      author: UserMigrator.loadFromResponse(data.Author),
      createdAt: new Date(data.IssuedOn),
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      Tittle: data.title,
      Summary: data.summary,
    }
  }
}

export default new FeedMigrator();
