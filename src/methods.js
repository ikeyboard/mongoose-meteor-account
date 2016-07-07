/**
 * Created by rom on 18/04/2016.
 */
import Chance from 'chance';
import Password from './password';
import { INVALID_RESET_TOKEN } from './errors';

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

  generateResetPasswordToken() {
    const token = chance.hash(); // 40 chars by default
    this.resetToken = token;
    return this.save();
  },

  verifyResetToken(token) {
    return new Promise((resolve, reject) => {
      if (this.resetToken === token) {
        resolve()
      } else {
        reject(INVALID_RESET_TOKEN);
      }
    });
  },

  resetPassword(token, password) {
    return this.verifyResetToken(token)
      .then(() => this.changePassword(password))
      .then(() => {
        this.resetToken = "";
        return this.save();
      });
  }
};
