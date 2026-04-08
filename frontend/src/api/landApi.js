import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// GET all properties
export const getProperties = () => API.get("/properties");

// GET single property
export const getProperty = (id) => API.get(`/properties/${id}`);

// POST transfer
export const transferProperty = (id, data) =>
  API.post(`/properties/${id}/transfer`, data);

// GET ledger
export const getLedger = (id) => API.get(`/ledger/${id}`);

// POST AI analysis
export const analyzeProperty = (id) =>
  API.post(`/analysis/${id}`);

export default API;