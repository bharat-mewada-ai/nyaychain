import { useState } from 'react';
import { analyzeProperty } from '../services/analysisService';

export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (propertyId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeProperty(propertyId);
      setResult(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, analyze };
}
