function ApplicationError(message, id, data) {
  this.message  = message;
  this.id       = id;
  this.data     = data;
}

//=============================================================================
module.exports = ApplicationError;
