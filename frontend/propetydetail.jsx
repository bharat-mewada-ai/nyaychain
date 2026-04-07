import { useState } from "react";
import { getProperty, runAnalysis } from "../api/landApi";

export default function PropertyDetail() {
  const [id, setId] = useState("");
  const [property, setProperty] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const fetchProperty = async () => {
    const res = await getProperty(id);
    setProperty(res.data);
  };

  const analyze = async () => {
    const res = await runAnalysis(id);
    setAnalysis(res.data);
  };

  return (
    <div>
      <input onChange={e => setId(e.target.value)} placeholder="PROP-003" />
      <button onClick={fetchProperty}>Search</button>

      {property && (
        <div>
          <h2>{property.address}</h2>
          <button onClick={analyze}>Run AI Analysis</button>
        </div>
      )}

      {analysis && (
        <div>
          <h3>Risk: {analysis.risk_level}</h3>
          <p>{analysis.fraud_probability}%</p>
          <ul>
            {analysis.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}