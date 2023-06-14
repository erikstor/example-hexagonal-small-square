import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { estados } from '../../app/interfaces/order.interfaces';

@ValidatorConstraint()
export class StatusFieldValidator implements ValidatorConstraintInterface {
  validate(name: string) {
    return estados[name] ? true : false;
  }
}
