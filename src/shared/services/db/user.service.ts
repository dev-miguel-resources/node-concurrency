import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { UserModel } from '@user/models/user.schema';

class UserService {
  // query para agregar user to DB
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }

  // aquí se verán otras querys
}

export const userService: UserService = new UserService();
