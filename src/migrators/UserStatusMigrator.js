class UserStatusMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      userId: data.Author._id,
      consultationId: data._idConsulta,
      folderId: data.idFolderToBelong,
      status: data.Status
    }
  }
  saveForRequest(data) {
    return {
      _id: data._id,
      _idConsulta: data.consultationId,
      idFolderToBelong: data.folderId,
      Status: data.status
    }
  }

}

export default new UserStatusMigrator();
