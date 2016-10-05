/**
 * Created by chenrozenes on 07/07/2016.
 */

import ExtendableError from 'es6-error';

class AccountError extends ExtendableError {
  constructor(type, code, message) {
    super(message);
    this.type = type;
    this.code = code;
    this.errno = code;
  }
}

export { AccountError };
export const LOGIN_FAILED = new AccountError('LOGIN_FAILED', 11, 'Login failed');
export const LOGIN_FAILED_UNVERIFIED = new AccountError('LOGIN_FAILED_UNVERIFIED', 12, 'The user is not verified');
export const LOGIN_FAILED_PASSWORD_EXPIRED = new AccountError('LOGIN_FAILED_PASSWORD_EXPIRED', 13, 'The password of the user is expired');
export const INVALID_RESET_TOKEN = new AccountError('INVALID_RESET_TOKEN', 21, 'Invalid reset token');
export const INVALID_VERIFICATION_TOKEN = new AccountError('INVALID_VERIFICATION_TOKEN', 22, 'Invalid verification token');
export const WEAK_PASSWORD = new AccountError('WEAK_PASSWORD', 31, 'The password is not strong enough');
export const ACCOUNT_LOCKED = new AccountError('ACCOUNT_LOCKED', 41, 'Account is locked');
