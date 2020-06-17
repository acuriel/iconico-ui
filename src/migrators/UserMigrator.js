class UserMigrator{
  loadFromResponse(data) {
    // console.log(data);
    const email = data.UserName || data.userName;
    return {
      id: data._id,
      userName: email,
      email: email,
      isInternal: email.endsWith("iconico.es")
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      UserName: data.userName,
      UserEmail: data.email
    }
  }

  loadFromToken(data){
    const user = typeof data === "string" ? JSON.parse(data) : data;
    return {
      id:'',
      userName: user.userName,
      email: user.userName,
      token: user.access_token,
      isInternal: user.userName.endsWith("iconico.es")
    }
  }
}

export default new UserMigrator();
