import axios from 'axios';

const API_BASE_URL = "https://localhost:5001/";

export default axios.create({ baseURL: API_BASE_URL });
