import axios from "axios";

// Use your Render backend URL
const API = "https://nyaychain-mzlk.onrender.com/api";

export const getProperty = (id) => axios.get(`${API}/properties/${id}`);
export const runAnalysis = (id) => axios.post(`${API}/analysis/${id}`);
export const getLedger = () => axios.get(`${API}/ledger`);
export const verifyLedger = () => axios.get(`${API}/ledger/verify`);