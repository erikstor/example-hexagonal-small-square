import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {SignUpUsersTypes} from "../../domain/interfaces/users";

@ValidatorConstraint()
export class RegisterEmployeePhoneFieldValidator implements ValidatorConstraintInterface {
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
export class RegisterEmployeeTypeFieldValidator implements ValidatorConstraintInterface {
    validate(type: string) {
        return SignUpUsersTypes.hasOwnProperty(type)
    }
}