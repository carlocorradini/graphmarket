# Graph Market

### Online e-commerce API in GraphQL

[![Build](https://github.com/carlocorradini/graphmarket/workflows/build/badge.svg)](https://github.com/carlocorradini/graphmarket/actions)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/eab19cd392424e41afec10b001aaeadd)](https://www.codacy.com/gh/carlocorradini/graphmarket/dashboard?utm_source=github.com&utm_medium=referral&utm_content=carlocorradini/graphmarket&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/carlocorradini/graphmarket/branch/main/graph/badge.svg?token=VKZLWJYNY2)](https://codecov.io/gh/carlocorradini/graphmarket)
[![Known Vulnerabilities](https://snyk.io/test/github/carlocorradini/graphmarket/badge.svg)](https://snyk.io/test/github/carlocorradini/graphmarket)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket?ref=badge_shield)

## Members

|  Name  |  Surname  |     Username     |    MAT     |
| :----: | :-------: | :--------------: | :--------: |
| Carlo  | Corradini | `carlocorradini` | **223811** |
| Andrea |  Stedile  | `andreastedile`  | **220930** |

## Run

1. Clone the repo and install the dependencies

```console
$  git clone https://github.com/carlocorradini/graphmarket
$  cd graphmarket
$  npm ci
```

2. Bootstrap packages

```console
$  npm run bootstrap
```

3. Edit environments

To properly configure a service you must define an environment.
In every service folder (_packages/graphmarket-service-\*_) copy and rename the _.env.example_ file to _.env_.
Edit the _.env_ file with the required variables (database, redis, adapter, ...).

The process described above must be applied to the gateway also (_packages/graphmarket-gateway_).

```console
$  cp .env.example .env
```

4. Start services

   1. Development mode

   ```console
   $  npm run start:dev:services
   ```

   2. Production mode

   ```console
   $  npm run start:services
   ```

   > Note that in production the _.env_ file is ignored. You must inject or define globally each environment variable

> Each service can also be started individually running `npm run start:dev` (development) or `npm run start` (production) with context the service folder itself

5. Start gateway

   1. Development mode

   ```console
   $  npm run start:dev:gateway
   ```

   2. Production mode

   ```console
   $  npm run start:gateway
   ```

   > Note that in production the _.env_ file is ignored. You must inject or define globally each environment variable

> The gateway can also be started running `npm run start:dev` (development) or `npm run start` (production) with context the gateway folder itself

> The gateway can be started before the services thanks to a health check procedure in the bootstrap phase. After 3 failed attempts to establish the connection with the services the gateway raise an error and exit

6. Start website

   1. Change context

   ```console
   $  cd website
   ```

   2. Install dependencies

   ```console
   $  npm ci
   ```

   3. Edit environment

   > Angular environment is under _src/environments_

   4. Builds and serve

   ```console
   $  ng serve --open
   ```

7. Run tests

> Current context is the root folder (graphmarket)

```console
$  npm test
```

8. Run coverage

> Current context is the root folder (graphmarket)

```console
$  npm run coverage
```

## License

MIT

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket?ref=badge_large)
