import { analyzeProperty } from "../api/landApi";
import { useState } from "react";

export default function Analyze({ id }) {
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    const res = await analyzeProperty(id);
    setResult(res.data);
  };

  return (
    <div>
      <button onClick={handleAnalyze}>Analyze</button>

      {result && (
        <div>
          <h2>{result.risk_level}</h2>
          <p>{result.fraud_probability}%</p>
        </div>
      )}
    </div>
  );
}