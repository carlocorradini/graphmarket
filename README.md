# Graph Market

## Online e-commerce API in GraphQL

[![CI](https://github.com/carlocorradini/graphmarket/workflows/CI/badge.svg)](https://github.com/carlocorradini/graphmarket/actions)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/eab19cd392424e41afec10b001aaeadd)](https://www.codacy.com/gh/carlocorradini/graphmarket/dashboard?utm_source=github.com&utm_medium=referral&utm_content=carlocorradini/graphmarket&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/carlocorradini/graphmarket/branch/main/graph/badge.svg?token=VKZLWJYNY2)](https://codecov.io/gh/carlocorradini/graphmarket)
[![Known Vulnerabilities](https://snyk.io/test/github/carlocorradini/graphmarket/badge.svg)](https://snyk.io/test/github/carlocorradini/graphmarket)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket?ref=badge_shield)

## Members

|  Name  |  Surname  |     Username     |    MAT     |
| :----: | :-------: | :--------------: | :--------: |
| Carlo  | Corradini | `carlocorradini` | **223811** |
| Andrea |  Stedile  | `andreastedile`  | **220930** |

## License

MIT

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphmarket?ref=badge_large)

## Deploy manually

First, install Postgres and create a Postgres database.
Here, we use the default Postgres user and create a database called _graphqldb_.
```
$ sudo -u postgres psql
postgres=# createdb graphqldb
```

Install Redis.

Set the environment variables for the app:
```
export
```

Install the app:
```
$ npm ci
$ npm run start:dev
```

## Deploy with Docker compose

```
docker-compose -f <file> up --build
```

## Environment variables

`npm start` starts the app in *production* mode.

`npm run start:dev` starts the app in *development* mode.
