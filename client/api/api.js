import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Services
export const fetchServices = () => axios.get(`${API_URL}/services`);
export const createService = (service, token) => axios.post(`${API_URL}/services`, service, {
  headers: { Authorization: `Bearer ${token}` },
});
export const updateService = (id, service, token) => axios.put(`${API_URL}/services/${id}`, service, {
  headers: { Authorization: `Bearer ${token}` },
});
export const deleteService = (id, token) => axios.delete(`${API_URL}/services/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

// Enquiries
export const fetchEnquiries = (token) => axios.get(`${API_URL}/enquiries`, {
  headers: { Authorization: `Bearer ${token}` },
});
export const createEnquiry = (data) => axios.post(`${API_URL}/enquiries`, data);
export const updateEnquiry = (id, status, token) => axios.put(`${API_URL}/enquiries/${id}`, { status }, {
  headers: { Authorization: `Bearer ${token}` },
});
