import UserMigrator from "./UserMigrator";

class TruthMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      title: data.Title,
      summary: data.Summary,
      author: UserMigrator.loadFromResponse(data.Author),
      createdOn: data.CreatedOn,
      consultationId: data._idConsulta,
      consultationTitle: data.ConsultationTitle,
      consultationStart: data.ConsultationStart,
      consultationEnd: data.ConsultationEnd,
      members: data.Members,
    }
  }
  saveForRequest(data) {
    return {
      Title: data.title,
      Summary: data.summary,
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
