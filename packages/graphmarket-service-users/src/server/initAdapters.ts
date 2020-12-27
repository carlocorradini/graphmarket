import Container from 'typedi';
import { PhoneAdapter, EmailAdapter, UploadAdapter } from '@graphmarket/adapters';
import config from '@app/config';

const initAdapters = (): Promise<void> => {
  Container.get(PhoneAdapter).init(config.ADAPTERS.PHONE.USERNAME, config.ADAPTERS.PHONE.PASSWORD, {
    VERIFICATION: config.ADAPTERS.PHONE.SERVICES.VERIFICATION,
  });
  Container.get(EmailAdapter).init(config.ADAPTERS.EMAIL.API_KEY);
  Container.get(UploadAdapter).init(
    config.ADAPTERS.UPLOAD.CLOUD_NAME,
    config.ADAPTERS.UPLOAD.API_KEY,
    config.ADAPTERS.UPLOAD.API_SECRET,
    config.ADAPTERS.UPLOAD.FOLDER,
  );

  return Promise.resolve();
};

export default initAdapters;
