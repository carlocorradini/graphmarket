# express-jwt-blacklist

[![Build Status](http://img.shields.io/travis/layerhq/express-jwt-blacklist.svg)](https://travis-ci.org/layerhq/express-jwt-blacklist)
[![npm version](http://img.shields.io/npm/v/express-jwt-blacklist.svg)](https://npmjs.org/package/express-jwt-blacklist)

A library designed to be a complementary plugin for [express-jwt](https://github.com/auth0/express-jwt) middleware.

## Simple example

```javascript
var express = require('express');
var jwt = require('express-jwt');
var blacklist = require('express-jwt-blacklist');
var app = express();

app.use(
  jwt({
    secret: 'my-secret',
    isRevoked: blacklist.isRevoked,
  }),
);

app.get('/logout', function (req, res) {
  blacklist.revoke(req.user);
  res.sendStatus(200);
});

var server = app.listen(3000);
```

## Installation

    npm install express-jwt-blacklist

## Usage

By default in-memory cache is used to store blacklist data. I do **not** recommend using this in production and especially if you are dealing with multiple server instances. That's why this library provides two options for a fast key value store:

- [Memcached](https://github.com/3rd-Eden/node-memcached) - store type `memcached`
- [Redis](https://github.com/NodeRedis/node_redis) - store type `redis`

### blacklist.configure(options)

By passing `options` you can set the following:

- `store.type` - Store type `memory`, `memcached` or `redis` (default: `memory`)
- `store.client` - Client object, obviates store.host, store.port, store.options
- `store.host` - Store host (default: `127.0.0.1`)
- `store.port` - Store port (default: `11211` memcached, `6379` redis)
- `store.url` - Store url, obviates store.host, store.port
- `store.keyPrefix` - Key prefix for store to avoid collisions (default: `jwt-blacklist:`)
- `store.options` - Additional store client options (default: `{}`)
- `tokenId` - JWT claim unique to user (default: `sub`)
- `indexBy` - JWT claim used for revocation (default: `iat`), note that purge still uses `iat`
- `strict` - Strict revocation policy will return revoked `true` on store failure (default: `false`)

```javascript
blacklist.configure({
  tokenId: 'jti',
  strict: true,
  store: {
    type: 'memcached',
    host: '127.0.0.1',
    port: 11211,
    keyPrefix: 'mywebapp:',
    options: {
      timeout: 1000
    }
  }
});
```

### blacklist.isRevoked

This function it s plug-in for express-jwt [revoked tokens](https://github.com/auth0/express-jwt#revoked-tokens) function. It will take care of the `isRevoked` callback and handle the validation internally.

### blacklist.revoke(user, [optionalLifetime], [optionalCallbackFn])

This function will revoke a token, by passing in a token payload skeleton in the `req.user` format set by the express-jwt library. The lifetime of the revocation entry in the store, can optionally be set explicitly (in seconds), and is otherwise calculated from the `exp` claim. If no argument is provided and the token is missing the `exp` claim, the revocation entry will not expire. An optional callback function can be supplied that will be called on error with the error as its only argument.

Typically, the server backend will call this function when a particular route is hit and the token to be revoked is the same one supplied for authentication, i.e. in a logout route initiated by the user in question. Alternatively, the backend can construct a token payload skeleton, which may be useful in a case where an admin user would like to forcibly logout a user from a single session. In the latter case, it may be useful to set the lifetime argument explicitly, as the proper value for the `exp` claim will likely be unavailable.

By default, revocation is based on the claim specified by `tokenId` as well as the `iat` claim, resulting in revocation of only the provided `req.user` token. The optional `index` configuration argument allows revocation of all tokens issued for a specific user that share the same value for the specified claim with `req.user`.

The `index` argument may be useful if tokens are being refreshed, and you would therefore like to invalidate some, but not all, of the previously issued tokens, e.g. only those from a specific session.

In particular, your token scheme may use the `sub` claim to represent the user, and the `jti` claim to represent a session, where the original and all subsequent refreshed tokens contain identical `sub` and `jti` claims, but other sessions for the user contain an identical `sub` claim, but different `jti` claims. In this scenario, `tokenId` would be set to `sub` (the default), and the `index` should be set to `jti`. Note that if one user in this scenario is issued a token with a `jti` claim identical to a token that has been revoked for a different user, it will still not be marked as revoked, as revocation is always based on the `tokenId` as well as the `index` argument.

### blacklist.purge(user, [optionalLifetime], [optionalCallbackFn])

This function will purge **all** tokens older than current timestamp, by passing in a a token payload skeleton in the `req.user` format set by the express-jwt library. The lifetime of the revocation entry in the store, can optionally be set explicitly (in seconds), and is otherwise calculated from the `exp` claim. If no argument is provided and the token is missing the `exp` claim, the revocation entry will not expire. An optional callback function can be supplied that will be called on error with the error as its only argument.

Typically, the server backend will call this function when a particular route is hit and the tokens to be purged are similar to the one supplied for authentication, i.e. in a password change route initiated by the user in question. Alternatively, the backend can construct a token payload skeleton, which may be useful in a case where an admin user would like to forcibly logout all sessions for a different user. In the latter case, it may be useful to set the lifetime argument explicitly, as the proper value for the `exp` claim will likely be unavailable.

### Custom store

You can implement your own store by passing `store` object that implements these two functions:

- `get(key, callback)`
- `set(key, data, lifetime, callback)`

### Token Payload Considerations

User object `req.user` that's being set by the express-jwt library **should** contain claims matching `tokenId` and 'indexBy' from configuration.

- At a minimum, you need to set either `sub` or `jti` or some other claim in the payload when signing a JWT token to identify a user.
- Expiration timestamp `exp` claim is optional but desired, as it will allow for expiration of revocation entries from the store, increasing the speed of the `isRevoked` check. Alternatively, a specified lifetime value can be passed to each revoke/purge call by the backend.
- Issued at `iat` timestamp claim must be present, even if `indexBy` is set to another claim, so as to allow purge operations to work. `iat` is also used to calculate token lifetime, if no specified lifetime is set, and `exp` is present.

## Why blacklist?

[JSON Web Tokens](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) have many applications. One of the more popular one is using them as a **non-persistent** session tokens for your web app.

They are signed with a secret phrase or a private key, this makes token verification extremely fast, no database lookups just cryptography. Tokens are being issued once user has been successfully authenticated and contain expiration timestamp, they become invalid once the expiration time is up.

Tokens are usually stored on the client, browser cookie, local storage or some other store. By having a non-persistent session tokens we loose the ability to **revoke** them once they're out in the wild.

The Open Web Application Security Project states this in the [Session Management](https://www.owasp.org/index.php/Session_Management_Cheat_Sheet) section

- **Session Expiration**: _"When a session expires, the web application must take active actions to invalidate the session on both sides, client and server. The latter is the most relevant and mandatory from a security perspective. In order to close and invalidate the session on the server side, it is mandatory for the web application to take active actions when the session expires, or the user actively logs out."_

- **Privilege Level Change**: _"The session ID must be renewed or regenerated by the web application after any privilege level change within the associated user session. Previous session IDs have to be ignored, a new session ID must be assigned to every new request received for the critical resource, and the old or previous session ID must be destroyed."_

> Even without token revocation mechanism, using JWT tokens is considered secure as long as you **only** send them over secure connection SSL.

## Common use case

- User logs out of your web application, we want to invalidate this specific session token on the server so that it can't be used again. `blacklist.revoke(req.user)`

- User password change or permission change, we want invalidate all session tokens older than the time of this event. `blacklist.purge(req.user)`

## Testing

The unit tests are based on the [mocha](https://github.com/mochajs/mocha) module, which may be installed via npm. To run the tests make sure that the npm dependencies are installed by running `npm install` from the project directory.

    npm test

## Contributing

express-jwt-blacklist is an Open Source project maintained by Layer. Feedback and contributions are always welcome and the maintainers try to process patches as quickly as possible. Feel free to open up a Pull Request or Issue on Github.

## Author

[Nil Gradisnik](https://github.com/nilgradisnik)
