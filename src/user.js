/**
 * Created by rom on 18/04/2016.
 */

import _ from 'lodash';
import mongoose from 'mongoose';

import UserSchema from './schema';
import UserMethods from './methods';
import UserStatics from './statics';
import defaultConfig from './defaultConfig';

/**
 * User plugin for mongoose
 * @param schema
 * @param options
 * @constructor
 */
export default function UserPlugin(schema, options = defaultConfig) {
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
   */
  schema.virtual('email').get(function () {
    return _.get(this.emails, '[0].address');
  });

  schema.virtual('verificationToken').set(function(token) {
    _.set(this.services, 'email.verificationTokens[0]', {
      token,
      address: this.email,
      when: new Date()
    });
  });

  schema.virtual('verificationToken').get(function () {
    return _.get(this.services, 'email.verificationTokens[0].token');
  });

  schema.virtual('isVerified').set(function(isVerified) {
    _.set(this.emails, '[0].verified', isVerified);
  });

  schema.virtual('isVerified').get(function () {
    return _.get(this.emails, '[0].verified');
  });

  /**
   * Add the methods
   */
  schema.methods = _.extend(schema.methods, UserMethods);

  /**
   * Add the statics
   */
  schema.statics = _.extend(schema.statics, UserStatics(options));
}
