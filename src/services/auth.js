import axios from 'axios';


const API = axios.create({ baseURL: 'http://localhost:5000/api' });


export const signup = (payload) => API.post('/auth/signup', payload).then(r => r.data);
export const login = (payload) => API.post('/auth/login', payload).then(r => r.data);
export const setAuthHeader = (token) => { API.defaults.headers.common['Authorization'] = `Bearer ${token}`; };