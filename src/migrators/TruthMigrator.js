import UserMigrator from "./UserMigrator";

class TruthMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      title: data.title,
      summary: data.summary,
      author: UserMigrator.loadFromResponse(data.author),
      createdOn: new Date(data.createdOn),
      consultationId: data._idConsulta,
      consultationTitle: data.consultationTitle,
      consultationStart: data.consultationStart,
      consultationEnd: data.consultationEnd,
      imageData: data.imageData,
      imageMimeType: data.imageMimeType,
      tags:data.tags || [],
      members: data.members,
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      title: data.title,
      summary: data.summary,
      tags: data.tags,
      _idConsulta: data.consultationId,
    }
  }
  getEmpty(consultationId){
    return {
      title: "",
      summary: "",
      consultationId: consultationId,
    }
  }
}

export default new TruthMigrator();
