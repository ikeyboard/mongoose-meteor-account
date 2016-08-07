# mongoose-meteor-account
Meteor account system implemented in Mongoose

[![Circle CI](https://circleci.com/gh/bookmd/mongoose-meteor-account.svg?style=shield)](https://circleci.com/gh/bookmd/mongoose-meteor-account)

Implement of the Meteor account system for Mongoose.<br />
Now you can build new application with the same DB as your Meteor application, and authenticate with the same users!<br />
Support change password with strength validation using [zxcvbn](https://github.com/dropbox/zxcvbn).

<b>Usage</b>:
```js
import mongoose from 'mongoose';

import UserPlugin from 'mongoose-meteor-account';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.plugin(UserPlugin, {
  verifiedLogin: true, // Make sure the user is verified (by email)
  expirePasswordDays: 90, // When the password expired
  oldPasswords: 5, // Don't let the user change his password to used one (save 5 password)
  minPasswordStrength: 2, // zxcvbn minimum strength
});

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
```

<b>Config</b>:
- `verifiedLogin` - Check during the login if the email of the user is verified or not (default: false)
- `expirePasswordDays` - After how many days the passwords of the user is expired, 0 is unlimited (default: 0)
- `oldPasswords` - How many old password to save for avoid the usage of the same password twice, 0 is unlimited (default: 0)
- `minPasswordStrength` - The minimum strength in `zxcvbn` rating for the password, 0 won't check (default: 0)

<b>Statics</b>:
- User.login(username, password, throwError = false) - Return Promise of the user if success, false if not. The user must be verified in order to login. If throwError is `true`, the login will throw an error with the reason if the login failed.

<b>Methods</b>:
- user.changePassword(password) - Change the password
- user.comparePassword(password) - Compare given plain password to the password in the DB
- user.generateResetPasswordToken() - Generates a token for reset password process
- user.verifyResetToken(token) - Checks if the provided token is equal to the generated reset token
- user.resetPassword(token, password) - Changes the user's password if the token matches the generated one. Deletes the token afterwards
- user.generateVerificationToken() - Generates a token for verification (usually being sent via email)
- user.verifyVerificationToken(token) - Checks if the provided token is equal to the generated verification token
- user.verifyUser(token) - Verifies the user by the provided token. Deletes the token afterwards

>
</i>
<b>Password</b><br />
the password can be a plain string of the password, or an object of hashed (sha256) of the password, as Meteor send the password in the client.
</i>

<b>Todo</b>:
- Add `create new User (register)`
- Add `remove user`
- Add `Add new email`
- Add `Set email as primary`
