import axios from 'axios';

const API = axios.create({
baseURL: 'https://social-connect-fu3g-hp50ctmkd-vikash-mandals-projects.vercel.app
', // Adjust the port if your backend runs on a different one
});

API.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

export default API;
