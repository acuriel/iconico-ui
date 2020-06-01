import UserMigrator from "./UserMigrator";

class CommentMigrator{
  loadFromResponse(data) {
    if(!data) return undefined;
    return {
      id: data._id,
      consultationId: data._idConsulta,
      text: data.CommentText,
      postedOn: new Date(data.PostedOn),
      author: UserMigrator.loadFromResponse(data.Author),
      mentions: data.Mentions?.map(u => UserMigrator.loadFromResponse(u)),
      highlighted: data.HighLighted,
      highLightedBy: data.HighLightedBy?.map(u => UserMigrator.loadFromResponse(u)),
      replyTo: this.loadFromResponse(data.ThisCommentAnswersTo),
      imageData: data.ImageData,
      imageMimeType: data.ImageMimeType,
    }
  }
  saveForRequest(data) {
    console.log(data);
    if(!data) return undefined;
    return {
      _id: data.id,
      _idConsulta: data.consultationId,
      CommentText: data.text,
      Author: data.author ? UserMigrator.saveForRequest(data.author) : undefined,
      ThisCommentAnswersTo: this.saveForRequest(data.replyTo),
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
