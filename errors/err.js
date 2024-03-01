class NotFoundError extends Error { 
    constructor(entity) {
        super(`${entity} not found`);
        this.name = "NotFoundError";
        this.status  = 404;
    }
}

class BadRequsetError extends Error {
    constructor(element) {
        super(`Pleasse provide: ${element}`);
        this.name = "BadRequsetError";
        this.status  = 400;
    }
}

class ServerError extends Error {
    constructor(action) {
        super(`Internal Server Error - Couldn't ${action} shelter`);
        this.name = "ServerError";
        this.status  = 500;
    }
}

module.exports = {NotFoundError,BadRequsetError,ServerError}