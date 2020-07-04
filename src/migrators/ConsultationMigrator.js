import UserMigrator from './UserMigrator';

class ConsultationMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      title: data.tittle,
      description:data.description,
      author: UserMigrator.loadFromResponse(data.author),
      internalMembers:data.internalMembers.map(m => UserMigrator.loadFromResponse(m)),
      issuedOn: new Date(data.issuedOn),
      expiresOn: new Date(data.expiresOn),
      finished:data.isManuallyFinished,
      finishedOn: new Date(data.manuallyFinishedOn),
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      tittle: data.title,
      description:data.description,
      author: data.author ? UserMigrator.saveForRequest(data.author) : undefined,
      internalMembers:data.internalMembers.map(m => UserMigrator.saveForRequest(m)),
      issuedOn:data.issuedOn,
      expiresOn:data.expiresOn,
      isManuallyFinished:data.finished,
      manuallyFinishedOn:data.finishedOn,
    }
  }
}

export default new ConsultationMigrator();
