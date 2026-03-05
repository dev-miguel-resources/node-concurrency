import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { IAuthDocument } from './authDocument.interface';

export interface IAuthJob {
  value?: string | IAuthDocument | IUserDocument;
}
