# mongoose-meteor-account
Meteor account system implemented in Mongoose

[![Circle CI](https://circleci.com/gh/bookmd/mongoose-meteor-account.svg?style=shield)](https://circleci.com/gh/bookmd/mongoose-meteor-account)

Implement of the Meteor account system for Mongoose.<br />
Now you can build new application with the same DB as your Meteor application, and authenticate with the same users!

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

UserSchema.plugin(UserPlugin);

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
```

<b>Statics</b>:
- User.login(username, password) - Return Promise of the user if success, false if not

<b>Methods</b>:
- user.changePassword(password) - Change the password
- user.comparePassword(password) - Compare given plain password to the password in the DB 
- user.generateResetPasswordToken() - Generates a token for reset password process
- user.verifyResetToken(token) - Checks if the provided token is equal to the generated one
- user.resetPassword(token, password) - Changes the user's password if the token matches the generated one

>
</i>
<b>Password</b><br />
the password can be a plain string of the password, or an object of hashed (sha256) of the password, as Meteor send the password in the client.
</i>

<b>Todo</b>:
- Add `create new User (register)`
- Add `remove user`
- Add `verify an email`
- Add `Add new email`
- Add `Set email as primary`
