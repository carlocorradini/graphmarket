import { EnvUtil } from '@app/util';
import config from '@app/config';

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'express-jwt';
import blacklist from 'express-jwt-blacklist';

const app = express();

app.use('trust proxy');
app.use(compression());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: EnvUtil.isProduction() ? undefined : false }));
app.use(
  config.GRAPHQL.PATH,
  jwt({
    secret: config.JWT.SECRET,
    algorithms: [config.JWT.ALGORITHM],
    credentialsRequired: false,
    // TODO Problem in response when the token is revoked
    isRevoked: blacklist.isRevoked,
  }),
);

export default app;
