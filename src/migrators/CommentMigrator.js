import UserMigrator from "./UserMigrator";

class CommentMigrator{
  loadFromResponse(data) {
    if(!data) return undefined;
    return {
      id: data._id,
      consultationId: data._idConsulta,
      text: data.commentText,
      postedOn: new Date(data.postedOn),
      author: UserMigrator.loadFromResponse(data.author),
      mentions: data.mentions?.map(u => UserMigrator.loadFromResponse(u)),
      highlighted: data.highLighted,
      highLightedBy: data.highLightedBy?.map(u => UserMigrator.loadFromResponse(u)),
      replyTo: this.loadFromResponse(data.thisCommentAnswersTo),
      imageData: data.imageData,
      imageMimeType: data.imageMimeType,
    }
  }
  saveForRequest(data) {
    if(!data) return undefined;
    return {
      _id: data.id,
      _idConsulta: data.consultationId,
      commentText: data.text,
      author: data.author ? UserMigrator.saveForRequest(data.author) : undefined,
      thisCommentAnswersTo: this.saveForRequest(data.replyTo),
      mentions: data.mentions.map(u => UserMigrator.saveForRequest(u))
    }
  }
  getEmptyElement(consultationId){
    return {
      consultationId: consultationId,
      text: "",
      replyTo: undefined,
      imageData: undefined,
      mentions: [],
      highLightedBy: []
    }
  }
}

export default new CommentMigrator();
