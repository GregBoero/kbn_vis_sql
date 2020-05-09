import axios from 'axios';
import {FETCH_TIMEOUT} from '../constants';

export const fetch = (() => {
  let api = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'kbn-xsrf': 'professionally-crafted-string-of-text',
    },
    timeout: FETCH_TIMEOUT,

  });

  api.interceptors.request.use(value => value, error => Promise.reject(error));
  api.interceptors.response.use(value => value, error => Promise.reject(error));
  return api;
})();
