import axios from 'axios';

const DEV = "dev", PROD = "prod";
const ENV = PROD; // DEV or PROD
const API_BASE_URL = ENV === DEV ? "http://localhost:3000/" : "https://localhost:44335/";

export default axios.create({ baseURL: API_BASE_URL });
