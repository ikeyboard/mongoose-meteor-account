/**
 * Created by rom on 18/04/2016.
 */

export default {
    _id: String,
    username: {
      type: String,
      required: true,
    },
    services: {
      password: {
        bcrypt: { type: String, select: false },
        reset: {
          token: String,
          when: Date,
        }
      },
    },
    "emails": {
      type: [{
        address: {
          type: String,
          required: true,
        },
        verified: {
          type: Boolean,
          required: true,
          default: false,
        },
        primary: {
          type: Boolean,
          required: true,
          default: false,
        },
      }]
    },
    profile: {
      type: {
        firstName: {
          type: String,
          required: false,
        },
        lastName: {
          type: String,
          required: false,
        },
      },
      required: true,
    },
    roles: {
      type: [String]
    },
  };
