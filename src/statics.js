/**
 * Created by rom on 18/04/2016.
 */

export default function (config) {
  return {
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
          if (!!user) {
            return user.comparePassword(password)
              .then((res) => {
                // Enforcing user verification only if configured
                const verificationCheck = config.verifiedLogin === true ? user.isVerified === true : true;
                if (res && verificationCheck) return user;
                return false;
              })
          }
          else {
            return false;
          }
        });
    },
  }
};
