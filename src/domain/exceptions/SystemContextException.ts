export class SystemContextException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SystemContextException';
        Object.setPrototypeOf(this, SystemContextException.prototype);
    }
}