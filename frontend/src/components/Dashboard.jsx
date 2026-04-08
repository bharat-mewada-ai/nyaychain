import { useEffect, useState } from "react";
import { getProperties } from "../api/landApi";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProperties().then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Properties</h1>

      {data.map(p => (
        <div key={p.propertyId}>
          <h3>{p.propertyId}</h3>
          <p>{p.currentOwner}</p>
          <p>{p.address}</p>
        </div>
      ))}
    </div>
  );
}