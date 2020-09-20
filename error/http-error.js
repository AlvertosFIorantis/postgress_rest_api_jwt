class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // add a message property
    this.code = errorCode; // this add code property
  }
}

module.exports = HttpError;

// afto einai to custom error class pou ftiaxno opote exo error tha kano throw afto to http eror kai apla tha prepei na prostheto to message kai code property analoga me to error pou exo kathe fora
