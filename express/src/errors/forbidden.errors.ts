import CustomAPIError from "./custom.errors";

class ForbiddenError extends CustomAPIError {
    statusCode: number;
    constructor(message:string) {
        super(message);
        this.statusCode = 403;
    }
}

export default ForbiddenError;
