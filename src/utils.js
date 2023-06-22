import { getAuth } from 'firebase/auth';

import firebaseApp from './firebase';

export const sleep = (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getIdTokenFromCurrentUser = async () => {
  const auth = getAuth(firebaseApp);

  const { currentUser } = auth;

  if (!currentUser) {
    return undefined;
  }

  const token = await currentUser.getIdToken();

  return token;
};

export const getErrorMessage = (object = {}) => {
  const message = 'something went wrong...';

  const { response } = object;

  if (!response) return message;

  const { data } = response;

  if (!data) return message;

  const { message: messageFromServer } = data;

  if (!messageFromServer) return message;

  return messageFromServer;
};
