/* eslint-disable global-require */
const TABLE = 'users';
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const auth = require('../../../auth');
const error = require('../../../utils/error');

const TABLE_TOKEN = 'tokens';
module.exports = (injectedStore) => {
  let store = injectedStore;
  if (!store) {
    store = require('../../../store/dummy');
  }

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;

    return re.test(email);
  }

  async function login(email, password) {
    const data = await store.query(TABLE, {
      email: email,
    });

    if (data.length !== 0) {
      const user = data[0];
      const equals = await bcrypt.compare(password, user.password);
      if (equals) {
        const response = await store.query(TABLE_TOKEN, {
          userId: user.id,
        });
        const token = response[0];
        if (token) {
          return {
            token: token.token,
          };
        }
        const tokenToInsert = {
          userId: user.id,
          token: auth.sign({
            user,
          }),
        };
        await store.insert(TABLE_TOKEN, tokenToInsert);
        return {
          token: tokenToInsert.token,
        };
      }
      throw error('Invalid User', 400);
    } else {
      throw error('User not found', 404);
    }
  }

  async function signup(data) {
    const user = {
      id: nanoid(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };

    if (!user.email || !validateEmail(user.email)) {
      throw error('User: the emails is required', 403);
    }
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 5);
    } else {
      throw error('User: the password is required', 403);
    }

    const response = await store.query(TABLE, {
      email: user.email,
    });
    if (response[0]) {
      throw error('User: the emails is unique', 403);
    }

    return store.insert(TABLE, user);
  }

  async function logout(user) {
    const res = await store.remove(TABLE_TOKEN, {
      userId: user.id,
    });
    console.log(res);
    return user;
  }

  return {
    login,
    logout,
    signup,
  };
};
