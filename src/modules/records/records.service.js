import axios from 'axios';

import enviroment from '../../environment';

import { getIdTokenFromCurrentUser } from '../../utils';

class RecordsService {
  async operate ({ userAuthUid, operation, a, b }) {
    const idToken = await getIdTokenFromCurrentUser();

    const { data } = await axios.post(enviroment.API_URL + 'v1/records/operation', {
      userAuthUid,
      operation,
      a,
      b
    }, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    return {
      ...data
    };
  }

  async getRecords ({ userAuthUid, q, take, skip, orderBy, order }) {
    const idToken = await getIdTokenFromCurrentUser();

    const { data } = await axios.get(enviroment.API_URL + 'v1/records', {
      params: {
        userAuthUid,
        q,
        take,
        skip,
        orderBy,
        order
      },
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    return {
      ...data,
      data: data.data.map((record) => ({
        id: record.id,
        uid: record.uid,
        userBalance: record.userBalance,
        result: record.operationResponse?.result,
        createdAt: record.createdAt
      }))
    };
  }

  async delete ({ uid }) {
    const idToken = await getIdTokenFromCurrentUser();

    const { data } = await axios.delete(enviroment.API_URL + 'v1/records', {
      params: {
        uid
      },
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    return {
      ...data
    };
  }
}

export const recordsService = new RecordsService();
