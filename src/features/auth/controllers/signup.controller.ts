import { Request, Response } from 'express';
import { signupSchema } from '../schemes/signup';
import { joiValidation } from '@decorators/joi-validation.decorator';
import { SignUpUtility } from './utilities/signup.utility';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { ObjectId } from 'mongodb';
import { Generators } from '@helpers/generators/generators';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';

export class SignUpController extends SignUpUtility {
  @joiValidation(signupSchema)
  public async register(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkIfUserExist = await authService.getUserByUsernameOrEmail(username, email);
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials for this user. User exists');
    }

    // Preparar los valores
    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Generators.generateRandomIntegers(12)}`;
    const passwordHash = await Generators.hash(password);
    //const authData: IAuthDocument;
  }
}
