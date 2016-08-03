/**
 * Created by rom on 18/04/2016.
 */

import _ from 'lodash';
import Chance from 'chance';
import zxcvbn from 'zxcvbn';
import Password from './password';
import { INVALID_RESET_TOKEN, INVALID_VERIFICATION_TOKEN, WEAK_PASSWORD } from './errors';

const chance = new Chance();

export default function (config) {
  return {
    /**
     * Compare given password to the password in the DB
     * @param password
     * @returns {*}
     */
    comparePassword(password) {
      return Password.comparePassword(password, this.password);
    },

    /**
     * Return the current hashed password of the user
     * We need it because we don't select the password when we query a user
     * @returns {Promise}
     * @private
     */
    _getCurrentPassword() {
      return this.collection.findOne({ _id: this._id }, { 'services.password.bcrypt': 1 })
        .then(user => user.services.password.bcrypt);
    },

    /**
     * Check for password strength using zxcvbn
     * @param password
     * @returns {boolean}
     * @private
     */
    _strengthCheck(password) {
      const strength = zxcvbn(password);
      return strength.score > (parseInt(config.minPasswordStrength) || 0);
    },

    /**
     * Check if the new password already used
     * @param password
     * @returns {*}
     * @private
     */
    _oldPasswordCheck(password) {
      // Check if we have to check it or not
      if (!parseInt(config.oldPasswords)) {
        return Promise.resolve(true);
      }

      // Calculate the slice number, minus 1 for the current password
      const oldPasswordSlice = -1 * (parseInt(config.oldPasswords) - 1); // 5 -> -4
      // Slice the list and get only the last passwords
      const oldPasswords = this.services.password.oldPasswords.slice(oldPasswordSlice);

      // Get the current password from the DB
      return this._getCurrentPassword()
        .then((currentPassword) => {
          // Add the password to the old password list
          oldPasswords.push(currentPassword);

          return oldPasswords;
        })
        // Check for each password it match the new password
        .map(oldPassword => Password.comparePassword(password, oldPassword))
        // If there is true (match), it means that the new password already used
        .then(res => !_.includes(res, true));
    },

    /**
     * Validate password strength
     * @param password
     * @returns {Promise.<boolean>|Promise|*}
     * @private
     */
    _changePasswordValidation(password) {
      // Combine both checks
      return Promise.all([
          this._strengthCheck(password),
          this._oldPasswordCheck(password),
        ])
        .then(res => !_.includes(res, false));
    },

    /**
     * Chagne the password in the database
     * @param password
     * @returns {Promise|Promise.<T>|*}
     */
    changePassword(password) {
      return this._changePasswordValidation(password)
        .then((validation) => {
          if (!validation) {
            throw WEAK_PASSWORD;
          }

          return Promise.props({
            hashedPassword: Password.hashPassword(password),
            oldPassword: this._getCurrentPassword(),
          });
        })
        .then((obj) => {
          // Push old password to an array
          if (!!parseInt(config.oldPasswords)) {
            let oldPasswords = this.services.password.oldPasswords;
            oldPasswords.push(obj.oldPassword);
            oldPasswords = _.takeRight(oldPasswords, parseInt(config.oldPasswords));
            this.services.password.oldPasswords = oldPasswords;
          }
          this.password = obj.hashedPassword;
          this.services.password.changeDate = new Date();
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
          resolve(true);
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
          resolve(true);
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
  }
};
