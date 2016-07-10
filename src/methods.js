/**
 * Created by rom on 18/04/2016.
 */
import Chance from 'chance';
import Password from './password';
import { INVALID_RESET_TOKEN, INVALID_VERIFICATION_TOKEN } from './errors';

const chance = new Chance();

export default {
  /**
   * Compare given password to the password in the DB
   * @param password
   * @returns {*}
   */
  comparePassword(password) {
    return Password.comparePassword(password, this.password);
  },

  /**
   * Chagne the password in the database
   * @param password
   * @returns {Promise|Promise.<T>|*}
   */
  changePassword(password) {
    return Password.hashPassword(password)
      .then((hashedPassword) => {
        this.password = hashedPassword;
        return this.save();
      });
  },

  /**
   * Generates a token for resetting password.
   * Later the token can be verified with "verifyResetToken"
   * @returns {*}
   */
  generateResetPasswordToken() {
    const token = chance.hash(); // 40 chars by default
    this.resetToken = token;
    return this.save();
  },

  /**
   * Compares the token provided to the reset token that is saved on the user
   * Returns a promise - resolves if the tokens are equal, otherwise rejects and throws an error
   * @param token
   * @returns {Promise}
   */
  verifyResetToken(token) {
    return new Promise((resolve, reject) => {
      if (this.resetToken === token) {
        resolve();
      } else {
        reject(INVALID_RESET_TOKEN);
      }
    });
  },

  /**
   * Changes the password to the provided one only if the token provided is equal to the
   * reset token saved in the db.
   * After changed, the reset token is deleted
   * @param token
   * @param password
   * @returns {Promise.<TResult>}
   */
  resetPassword(token, password) {
    return this.verifyResetToken(token)
      .then(() => this.changePassword(password))
      .then(() => {
        this.resetToken = "";
        return this.save();
      });
  },

  /**
   * Generates a token for verifying a new user.
   * Later the token can be verified with "verifyVerificationToken"
   * @returns {*}
   */
  generateVerificationToken() {
    const token = chance.hash(); // 40 chars by default
    this.verificationToken = token;
    return this.save();
  },

  /**
   * Compares the token provided to the verification token that is saved on the user
   * Returns a promise - resolves if the tokens are equal, otherwise rejects and throws an error
   * @param token
   * @returns {Promise}
   */
  verifyVerificationToken(token) {
    return new Promise((resolve, reject) => {
      if (this.verificationToken === token) {
        resolve();
      } else {
        reject(INVALID_VERIFICATION_TOKEN);
      }
    });
  },

  /**
   * Verifies the user's account provided one only if the token provided is equal to the
   * verification token saved in the db.
   * After changed, the verification token is deleted
   * @param token
   * @returns {Promise.<TResult>}
   */
  verifyUser(token) {
    return this.verifyVerificationToken(token)
      .then(() => {
        this.isVerified = true;
        this.verificationToken = "";
        return this.save();
      });
  }
};
