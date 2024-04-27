export class BadRequest extends Error {
    statusCode = 400;
    constructor(message: string) {
        super(message);
    }
}

export class NotFound extends Error {
    statusCode = 404;
    constructor(message: string) {
        super(message);
    }
}



export class InternalServerError extends Error {
    statusCode = 500;
    constructor(message: string) {
        super(message);
    }
}