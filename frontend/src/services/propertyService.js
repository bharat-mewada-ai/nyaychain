import { MOCK_PROPERTIES } from '../constants/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProperties = async (params = {}) => {
  await delay(600);
  let results = [...MOCK_PROPERTIES];

  if (params.search) {
    const q = params.search.toLowerCase();
    results = results.filter(p =>
      p.plotId.toLowerCase().includes(q) ||
      p.owner.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  }

  if (params.status && params.status !== 'all') {
    results = results.filter(p => p.status === params.status);
  }

  return results;
};

export const getProperty = async (id) => {
  await delay(400);
  const prop = MOCK_PROPERTIES.find(p => p.id === id);
  if (!prop) throw new Error('Property not found');
  return prop;
};
