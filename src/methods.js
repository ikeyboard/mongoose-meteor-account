/**
 * Created by rom on 18/04/2016.
 */
import jwt from 'jsonwebtoken';
import Password from './password';

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
        return true;
      });
  }
};
