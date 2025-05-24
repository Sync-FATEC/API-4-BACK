export class ChangePasswordDTO {
    private email: string;
    private currentPassword: string;
    private newPassword: string;
    private confirmPassword: string;

    constructor(email: string, currentPassword: string, newPassword: string, confirmPassword: string) {
        this.email = email;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    public getEmail(): string {
        return this.email;
    }

    public getCurrentPassword(): string {
        return this.currentPassword;
    }

    public getNewPassword(): string {
        return this.newPassword;
    }

    public getConfirmPassword(): string {
        return this.confirmPassword;
    }
}