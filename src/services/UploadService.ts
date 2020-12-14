/* eslint-disable class-methods-use-this */
import cloudinary from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import config from '@app/config';
import logger from '@app/logger';

/**
 * Resource.
 */
export enum Resources {
  IMAGE,
  VIDEO,
}

/**
 * Resources options.
 */
export const resourcesOptions: Record<Resources, cloudinary.UploadApiOptions> = {
  [Resources.IMAGE]: {
    resource_type: 'image',
    format: 'png',
    unique_filename: true,
    discard_original_filename: true,
  },
  [Resources.VIDEO]: {},
};

/**
 * Available resource types.
 */
export enum ResourceTypes {
  USER_AVATAR,
}

export interface IResourceTypeDescriptor {
  resource: Resources;
  folder: string;
  options: cloudinary.UploadApiOptions;
}

/**
 * Resource types descriptor.
 */
export const resourceTypesDescriptor: Record<ResourceTypes, IResourceTypeDescriptor> = {
  // Images
  [ResourceTypes.USER_AVATAR]: {
    resource: Resources.IMAGE,
    folder: 'user/avatar',
    options: { width: 512, height: 512, crop: 'fill', quality: 'auto:best' },
  },
  // Videos
};

export interface IUpload {
  resource: FileUpload;
  type: keyof typeof ResourceTypes;
  options?: cloudinary.UploadApiOptions;
}

cloudinary.v2.config({
  cloud_name: config.SERVICES.UPLOAD.CLOUDINARY_CLOUD_NAME,
  api_key: config.SERVICES.UPLOAD.CLOUDINARY_API_KEY,
  api_secret: config.SERVICES.UPLOAD.CLOUDINARY_API_SECRET,
});

/**
 * Upload service.
 *
 * @see cloudinary
 */
export default class UploadService {
  /**
   * Upload the given resource type.
   *
   * @param param0 - Upload type descriptor
   * @returns Uploaded resource information
   */
  public async upload({
    resource,
    type,
    options = {},
  }: IUpload): Promise<cloudinary.UploadApiResponse> {
    return new Promise((resolve, reject) => {
      resource.createReadStream().pipe(
        cloudinary.v2.uploader.upload_stream(
          this.constructUploadOptions(options, ResourceTypes[type]),
          (error, result) => {
            if (error) {
              logger.error(`Error uploading image due to ${error.message}`);
              reject(error);
            } else {
              logger.info(`Image uploaded successfully. Result is ${result}`);
              resolve(result!);
            }
          },
        ),
      );
    });
  }

  /**
   * Construct upload options object merging:
   *  - options
   *  - calculated options
   *  - resource type options
   *  - resource options
   *
   * @param options - Basic options
   * @param type - Resource type
   * @returns Full upload options object
   */
  private constructUploadOptions(
    options: cloudinary.UploadApiOptions,
    type: ResourceTypes,
  ): cloudinary.UploadApiOptions {
    return {
      ...options,
      ...{
        folder: config.SERVICES.UPLOAD.CLOUDINARY_FOLDER + resourceTypesDescriptor[type].folder,
      },
      ...resourceTypesDescriptor[type].options,
      ...resourcesOptions[resourceTypesDescriptor[type].resource],
    };
  }
}
