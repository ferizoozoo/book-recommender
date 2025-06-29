import {IValidate} from "../common/interfaces/i-validate.ts";

export class User implements IValidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    salt: string;

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        salt: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.salt = salt;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // TODO: maybe this validate method should be replaced with decorators.
    validate(): boolean {
        if (this.id < 0) {
            throw new Error('User ID must be a non-negative number.');
        }

        const nameRegex = /^[a-zA-Z' -]{2,50}$/;
        if (!this.firstName || !nameRegex.test(this.firstName)) {
            throw new Error('First name must be between 2 and 50 characters and contain valid characters.');
        }

        if (!this.lastName || !nameRegex.test(this.lastName)) {
            throw new Error('Last name must be between 2 and 50 characters and contain valid characters.');
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!this.email || !emailRegex.test(this.email)) {
            throw new Error('Email must be a valid email address.');
        }
        // While the regex limits the local part, RFC 5321 (SMTP) limits total email to 254 chars.
        // It's still good to have this explicit check for the whole string.
        if (this.email.length > 254) {
            throw new Error('Email cannot exceed 254 characters.');
        }

        const hashedPasswordRegex = /^.{60}$/; // Example for bcrypt
        if (!this.password || !hashedPasswordRegex.test(this.password)) {
            throw new Error('Invalid hashed password format or length.');
        }

        const saltRegex = /^\$[2BCYbc][a-zA-Z0-9./]{29}$/;
        if (!this.salt || !saltRegex.test(this.salt)) {
            throw new Error('Invalid salt format or length.');
        }

        return true;
    }
}