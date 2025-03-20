export class ChangePasswordDTO {
    private email: string;
    private oldPassword: string;
    private password: string;
    private passwordConfirmation: string;

    constructor(email: string, oldPassword: string, password: string, passwordConfirmation: string) {
        this.email = email;
        this.oldPassword = oldPassword;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
    }

    public getEmail(): string {
        return this.email;
    }

    public getOldPassword(): string {
        return this.oldPassword;
    }

    public getPassword(): string {
        return this.password;
    }

    public getPasswordConfirmation(): string {
        return this.passwordConfirmation;
    }
}