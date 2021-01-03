/* eslint-disable class-methods-use-this */
import { ReadStream } from 'fs';
import cloudinary from 'cloudinary';
import { Service } from 'typedi';

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
  resource: ReadStream;
  type: keyof typeof ResourceTypes;
  options?: cloudinary.UploadApiOptions;
}

/**
 * Upload adapter.
 *
 * @see cloudinary
 */
@Service()
export default class UploadAdapter {
  /**
   * Upload root folder.
   */
  private folder?: string;

  /**
   * Initialize a new upload adapter.
   *
   * @param cloudName - Cloud name
   * @param apiKey - Api key
   * @param apiSecret - Api secret
   */
  public init(cloudName: string, apiKey: string, apiSecret: string, folder: string) {
    cloudinary.v2.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    this.folder = folder;
  }

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
      resource.pipe(
        cloudinary.v2.uploader.upload_stream(
          this.constructUploadOptions(options, ResourceTypes[type]),
          (error, result) => {
            if (error) {
              reject(error);
            } else {
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
        folder: this.folder + resourceTypesDescriptor[type].folder,
      },
      ...resourceTypesDescriptor[type].options,
      ...resourcesOptions[resourceTypesDescriptor[type].resource],
    };
  }
}
