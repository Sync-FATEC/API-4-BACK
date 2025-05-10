export class ResponseModelDTO {
    private status: number;
    private model: any;
    private error: string;

    constructor(status: number, model?: any, error?: string) {
        this.status = status;
        this.model = model;
        this.error = error;
    }

    public getStatus(): number {
        return this.status;
    }

    public setStatus(status: number): void {
        this.status = status;
    }

    public getModel(): any {
        return this.model;
    }

    public setModel(model: any): void {
        this.model = model;
    }

    public getError(): string {
        return this.error;
    }

    public setError(error: string): void {
        this.error = error;
    }

    public static success(model: any): ResponseModelDTO {
        return new ResponseModelDTO(200, model);
    }

    public static error(error: string, status: number = 400): ResponseModelDTO {
        return new ResponseModelDTO(status, null, error);
    }

    public toJSON(): object {
        return {
            status: this.status,
            model: this.model,
            error: this.error
        };
    }
} 