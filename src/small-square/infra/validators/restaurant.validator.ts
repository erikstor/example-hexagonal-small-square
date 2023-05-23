import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class NombreFieldValidator implements ValidatorConstraintInterface {
    validate(name: string) {
        return isNaN(Number(name));
    }
}


@ValidatorConstraint()
export class TelefonoFieldValidator implements ValidatorConstraintInterface {
    validate(phone: string) {

        if (!phone) return false

        const characters = phone.split('+')[1]
        const firstChar = phone[0]

        if (firstChar !== '+' && !isNaN(Number(firstChar))) {
            return false
        }

        return !isNaN(Number(characters));

    }
}


@ValidatorConstraint()
export class UrlFieldValidator implements ValidatorConstraintInterface {
    validate(url: string) {

        const value = url.replace(/&#x2F;/g, '/')

        const urlRegex = /^(https?:\/\/)?([a-z0-9]+\.)+[a-z]{2,}(\/\S*)?$/i;

        return urlRegex.test(value);

    }
}