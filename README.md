# GraphQL Template

[![CI](https://github.com/carlocorradini/graphql-template/workflows/CI/badge.svg)](https://github.com/carlocorradini/graphql-template/actions)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a85c8af17a24cbbbf8e96df84cc3d5e)](https://app.codacy.com/gh/carlocorradini/graphql-template?utm_source=github.com&utm_medium=referral&utm_content=carlocorradini/graphql-template&utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/carlocorradini/graphql-template/badge.svg)](https://snyk.io/test/github/carlocorradini/graphql-template)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-template.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-template?ref=badge_shield)

## Members

| Name  |  Surname  |     Username     |    MAT     |
| :---: | :-------: | :--------------: | :--------: |
| Carlo | Corradini | `carlocorradini` | **223811** |
| Andrea | Stedile | `andreastedile` | **220930** |

## License

MIT

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-template.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-template?ref=badge_large)

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
