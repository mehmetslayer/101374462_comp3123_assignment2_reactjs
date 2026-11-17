import client from './client';

export const signup = (data) => client.post('/user/signup', data);

// the backend accepts either a username or an email
export const login = (identifier, password) => {
  const body = identifier.includes('@')
    ? { email: identifier, password }
    : { username: identifier, password };
  return client.post('/user/login', body);
};