import CustomAPIError from "./custom.errors";

class NotFoundError extends CustomAPIError {
    statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}

export default NotFoundError;
