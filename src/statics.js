/**
 * Created by rom on 18/04/2016.
 */

export default {
  /**
   * Login
   * Return the user if success, false if not
   * @param username
   * @param password
   * @returns {Promise.<T>}
   */
  login(username, password) {
    return this.findOne({username: username}).exec()
    .then((user) => {
      if (!!user) {
        return user.comparePassword(password)
        .then((res) => {
          if (res) return user;
          return false;
        })
      }
      else {
        return false;
      }
    });
  },
};
