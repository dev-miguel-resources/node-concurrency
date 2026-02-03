import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Iimage } from './imageResult.interface';

export function uploads(
  file: string, // archivo
  public_id?: string, // identificador de quien procesa el recurso
  overwrite?: boolean, // sobreescrituras o actualizaciones
  invalidate?: boolean // invalidar ciertos procesos
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined | Iimage> {
  return new Promise(resolve => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          resolve(error);
        }
        resolve(result);
      }
    );
  });
}
