export default interface ConfigInterface {
  NODE: {
    ENV: 'production' | 'development';
    PORT: number;
  };
  DATABASE: {
    TYPE: string;
    URL: string;
    SSL: boolean;
    SYNCHRONIZE: boolean;
    LOGGING: boolean;
    ENTITIES: string;
    MIGRATIONS: string;
    SUBSCRIBERS: string;
  };
}
