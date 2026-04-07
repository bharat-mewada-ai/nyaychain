import { useState } from 'react';
import * as transferService from '../services/transferService';

const STAGES = ['initiate', 'verify', 'approve', 'complete'];

export function useTransfer() {
  const [stage, setStage] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const advance = async (action, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await transferService[action](payload);
      setHistory(h => [...h, {
        stage: STAGES[stage],
        timestamp: new Date().toISOString(),
        ...res,
      }]);
      setStage(s => s + 1);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStage(0);
    setHistory([]);
    setError(null);
  };

  return { stage, history, loading, error, advance, reset, STAGES };
}
