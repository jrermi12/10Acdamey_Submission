import CustomAPIError from "./custom.errors";

class UnAuthenticatedError extends CustomAPIError {
  statusCode: number;
  constructor(message:string) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnAuthenticatedError;
