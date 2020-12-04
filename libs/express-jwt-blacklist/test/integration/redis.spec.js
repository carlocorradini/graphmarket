/*globals describe, it, before*/
'use strict';

var should = require('should');

var blacklist = require('../../lib');

var JWT_USER = {
  iat: Math.floor(new Date() / 1000),
  exp: Math.floor(new Date() / 1000) + 3600,
  sub: Math.random().toString(36).substring(2),
};

describe('Blacklist redis operations', function () {
  before(function (done) {
    blacklist.configure({
      store: {
        type: 'redis',
        keyPrefix: 'express-jwt-blacklist-test:',
      },
    });
    done();
  });

  it('isRevoked should return false', function (done) {
    blacklist.isRevoked({}, JWT_USER, function (err, revoked) {
      should.not.exist(err);
      revoked.should.be.false();
      done();
    });
  });

  it('revoke should revoke JWT token', function (done) {
    blacklist.revoke(JWT_USER, function (err, revoked) {
      should.not.exist(err);
      done();
    });
  });

  it('isRevoked should return true', function (done) {
    blacklist.isRevoked({}, JWT_USER, function (err, revoked) {
      should.not.exist(err);
      revoked.should.be.true();
      done();
    });
  });

  it('revoke should revoke another JWT token', function (done) {
    JWT_USER.iat += 10;
    blacklist.revoke(JWT_USER, function (err, revoked) {
      should.not.exist(err);
      done();
    });
  });

  it('isRevoked should return true', function (done) {
    blacklist.isRevoked({}, JWT_USER, function (err, revoked) {
      should.not.exist(err);
      revoked.should.be.true();
      done();
    });
  });
});
