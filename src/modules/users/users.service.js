import axios from 'axios';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import enviroment from '../../environment';

import firebaseApp from '../../firebase';

class UsersService {
  async register ({ email, password }) {
    const { data } = await axios.post(enviroment.API_URL + 'v1/users/registration', {
      email,
      password
    });

    return {
      ...data,
      message: 'User created successfully!'
    };
  }

  async login ({ email, password }) {
    const auth = getAuth(firebaseApp);

    const result = await signInWithEmailAndPassword(auth, email, password);

    const { user } = result;

    return user;
  }

  async logout () {
    const auth = getAuth(firebaseApp);

    auth.signOut();
  }
}

export const usersService = new UsersService();
