import CustomAPIError from "./custom.errors";

class BadRequestError extends CustomAPIError {
  statusCode: number;
  constructor(message:string) {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
