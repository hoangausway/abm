import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { writable, get } from 'svelte/store';
import { createPublicAxios, createPrivateAxios } from '../services/axios';
import { LOGIN_URL } from '../config/configs';

// store's figure
// { exp, name, email, location, role, accessToken, refreshToken }

const store = writable(null);
const { subscribe, set, update } = store;

const isAuthed = () => !!get(store);

const login = ({ email, password, location }) => {
  return Promise.resolve({ email: 'email', role: 'role' });

  // --- UNLOCK below code in real case
  // return axios.post(LOGIN_URL, { email, password, location })
  //   .then(({ data }) => {
  //     const { accessToken, refreshToken } = data;
  //     const { exp, name, email, location, role } = jwtDecode(accessToken);
  //     const userInfo = { name, email, location, role };
  //     set({ userInfo, exp, accessToken, refreshToken });
  //     return userInfo;
  //   })
  //   .catch(error => {
  //     set(null);
  //   });
};

const logout = () => set(null);

const createAxios = () => {
  const auth = get(store);
  if (!auth || !auth.accessToken) {
    return createPublicAxios();
  }
  return createPrivateAxios(auth);
};

export default {
  subscribe,
  set,
  update,
  isAuthed,
  login,
  logout,
  createAxios
};
