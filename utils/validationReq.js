function validationReq(type, value) {
  const emailRegex = /\S+@\S+\.\S+/;
  if (type === "email") {
    return emailRegex.test(value);
  }
}

module.exports = {
  validationReq
}
