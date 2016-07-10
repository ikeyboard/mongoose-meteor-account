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
    // Selecting password and emails (for getting the isVerified virtual)
    return this.findOne({username: username}).select('services.password.bcrypt emails').execAsync()
    .then((user) => {
      if (!!user && user.isVerified === true) {
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
