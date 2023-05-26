import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import { estados } from "src/small-square/app/interfaces/order.interfaces";

@ValidatorConstraint()
export class StatusFieldValidator implements ValidatorConstraintInterface {
    validate(name: string) {
        return estados[name]
    }
}