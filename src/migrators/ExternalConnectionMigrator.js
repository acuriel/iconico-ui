import UserMigrator from "./UserMigrator";

class ExternalConnectionMigrator{
  loadFromResponse(data) {
    return {
      id:data._id,
      consultationId:data._idConsulta,
      internalUser: UserMigrator.loadFromResponse(data.Author),
      externalUser: UserMigrator.loadFromResponse(data.Receiver),
      status: data.Status,
    }
  }
  saveForRequest(data) {
    return {

    }
  }
}

export default new ExternalConnectionMigrator();
