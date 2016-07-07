/**
 * Created by rom on 18/04/2016.
 */

import _ from 'lodash';
import mongoose from 'mongoose';


import UserSchema from './schema';
import UserMethods from './methods';
import UserStatics from './statics';

/**
 * User plugin for mongoose
 * @param schema
 * @param options
 * @constructor
 */
export default function UserPlugin(schema, options) {
  /**
   * Atach the schema
   */
  schema.add(UserSchema);

  /**
   * Add Virtual for password
   * Instead use Meteor long path for the password
   * user.services.password.bcrypt -> user.password
   */
  schema.virtual('password').set(function (password) {
    this.services.password.bcrypt = password;
  });

  schema.virtual('password').get(function () {
    return this.services.password.bcrypt;
  });

  schema.virtual('resetToken').set(function(token) {
    this.services.password.reset = {
      token,
      when: new Date()
    };
  });

  schema.virtual('resetToken').get(function() {
    return _.get(this.services.password, 'reset.token');
  });

  /**
   * Add Virtual fot email (only get!)
   * user.emails[primary].address -> user.email
   */
  schema.virtual('email').get(function () {
    const email = _.find(this.emails, {primary: true});
    return email ? email.address : undefined;
  });

  /**
   * Add the methods
   */
  schema.methods = _.extend(schema.methods, UserMethods);

  /**
   * Add the statics
   */
  schema.statics = _.extend(schema.statics, UserStatics);
};




