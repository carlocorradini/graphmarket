import Container from 'typedi';
import { PhoneAdapter, EmailAdapter, UploadAdapter } from '@graphmarket/adapters';
import config from '@app/config';

const initAdapters = (): Promise<void> => {
  Container.set(
    PhoneAdapter,
    new PhoneAdapter(config.ADAPTERS.PHONE.USERNAME, config.ADAPTERS.PHONE.PASSWORD, {
      VERIFICATION: config.ADAPTERS.PHONE.SERVICES.VERIFICATION,
    }),
  );
  Container.set(EmailAdapter, new EmailAdapter(config.ADAPTERS.EMAIL.API_KEY));
  Container.set(
    UploadAdapter,
    new UploadAdapter(
      config.ADAPTERS.UPLOAD.CLOUD_NAME,
      config.ADAPTERS.UPLOAD.API_KEY,
      config.ADAPTERS.UPLOAD.API_SECRET,
      config.ADAPTERS.UPLOAD.FOLDER,
    ),
  );

  return Promise.resolve();
};

export default initAdapters;
