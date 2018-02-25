class ApplicationException extends Error {
    constructor(message, code = 400) {
        super(message);
        this.name = this.constructor.name;
        this.status = code;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class NotFoundException extends ApplicationException {
    constructor(message = "Not Found", code = 404) {
        super(message, code);
    }
}

class EmptyValueException extends ApplicationException {
    constructor(message = "Empty Value", code = 400) {
        super(message, code);
    }
}

class InvalidValueException extends ApplicationException {
    constructor(message = "Invalid Value", code = 400) {
        super(message, code);
    }
}

class InvalidInputException extends ApplicationException {
    constructor(message = "Invalid Input", code = 400) {
        super(message, code);
    }
}

class DuplicateValueException extends ApplicationException {
    constructor(message = "Duplicate Value", code = 409) {
        super(message, code);
    }
}

class InvalidStateException extends ApplicationException {
    constructor(message = "Invalid State", code = 409) {
        super(message, code);
    }
}

class AuthFailedException extends ApplicationException {
    constructor(message = "Authentication failed", code = 401) {
        super(message, code);
    }
}

class AccessDeniedException extends ApplicationException {
    constructor(message = "Access denied", code = 403) {
        super(message, code);
    }
}

class HttpError extends ApplicationException {
    constructor(message = "Http error", response, code = 500) {
        super(message, code);
        if (response) {
            this.response = response;
        }
    }
}

module.exports = {
    ApplicationException: ApplicationException,
    NotFoundException: NotFoundException,
    EmptyValueException: EmptyValueException,
    InvalidValueException: InvalidValueException,
    InvalidInputException: InvalidInputException,
    DuplicateValueException: DuplicateValueException,
    InvalidStateException: InvalidStateException,
    AuthFailedException: AuthFailedException,
    AccessDeniedException: AccessDeniedException,
    HttpError: HttpError
};