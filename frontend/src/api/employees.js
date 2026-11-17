import client, { API_URL } from './client';

const BASE = '/emp/employees';

// multipart form so the profile picture can be sent with the text fields
const toFormData = (values, file) => {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.append(key, value));
  if (file) data.append('profile_picture', file);
  return data;
};

export const getEmployees = () => client.get(BASE);
export const searchEmployees = (params) => client.get(`${BASE}/search`, { params });
export const getEmployee = (id) => client.get(`${BASE}/${id}`);
export const createEmployee = (values, file) => client.post(BASE, toFormData(values, file));
export const updateEmployee = (id, values, file) => client.put(`${BASE}/${id}`, toFormData(values, file));
export const deleteEmployee = (id) => client.delete(BASE, { params: { eid: id } });

// the API stores a relative path like /uploads/<file>
export const pictureUrl = (path) => (path ? `${API_URL}${path}` : null);