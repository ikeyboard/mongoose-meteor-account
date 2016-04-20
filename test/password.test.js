/**
 * Created by rom on 18/04/2016.
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Password from '../src/password';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Password", function () {
  before(function () {
    this.password = Password;
  });

  describe("sha256", function () {
    it("Return the right hash", function () {
      const res = '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5';
      expect(this.password.sha256('12345')).to.be.equal(res);
    });
  });

  describe("getPasswordString", function () {
    it("Throw an error when the algorithm is not sha-256", function () {
      const password = {
        digest: "abc",
        algorithm: "sha1"
      };
      expect(() => this.password.getPasswordString(password)).to.throw(Error);
    });

    it("Return the same password when hashed", function () {
      const password = {
        digest: "abc",
        algorithm: "sha-256"
      };
      expect(this.password.getPasswordString(password)).to.be.equal(password.digest);
    });

    it("Return the right hash", function () {
      const digest = '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5';
      expect(this.password.getPasswordString('12345')).to.be.equal(digest);
    });
  });

  describe("hashPassword", function () {
    it("Return the right hash", function (done) {
      const hash = /^\$2a\$10\$/;

      expect(this.password.hashPassword('12345')).to.eventually.be.fulfilled
        .and.match(hash).notify(done);
    });
  });

  describe("comparePassword", function () {
    it("Return true when the password match", function (done) {
      const hash = '$2a$10$J/BwFNLwKY/xDz3M2kA6fOpeDBfjfb3.PB.wDcScU3Y/BF8t0xifa';

      expect(this.password.comparePassword('12345', hash)).to.eventually.be.fulfilled
        .and.equal(true).notify(done);
    });

    it("Return false when the password don't match", function (done) {
      const hash = '$2a$10$J/BwFNLwKY/xDz3M2kA6fOpeDBfjfb3.PB.wDcScU3Y/BF8t0xifa';

      expect(this.password.comparePassword('abc', hash)).to.eventually.be.fulfilled
        .and.equal(false).notify(done);
    });
  });

  describe("hash and compare", function () {
    it("Hash and compare", function (done) {
      const password = '12345';

      this.password.hashPassword(password)
        .then((hash) => {
          expect(this.password.comparePassword(password, hash)).to.eventually.be.fulfilled
            .and.equal(true).notify(done);
        });
    });
  });
});
