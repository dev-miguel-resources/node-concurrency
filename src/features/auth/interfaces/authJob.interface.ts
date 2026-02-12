import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { IAuthDocument } from './authDocument.interface';

// aquí puede que necesite algo más adelante
export interface IAuthJob {
  value?: IAuthDocument | IUserDocument;
}
