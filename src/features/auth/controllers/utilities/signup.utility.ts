import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { ISignUpData } from '@auth/interfaces/signUpData.interface';
import { Generators } from '@helpers/generators/generators';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { ObjectId } from 'mongodb';
import JWT from 'jsonwebtoken';
import { config } from '@configs/configEnvs';

export abstract class SignUpUtility {
  // public: lo puede utilizar cualquiera fuera de esta clase
  // private: solo en el contexto de la misma clase
  // protected: solo para los que la hereden

  // La data a ocupar para generar el documento de Auth
  protected signUpdata(data: ISignUpData): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id,
      uId,
      username: Generators.firstLetterUppercase(username),
      email: Generators.lowerCase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }

  // Generar la data de user a ocupar como documento
  protected userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Generators.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }

  // Firma de datos mediante token
  protected signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
  }
}
