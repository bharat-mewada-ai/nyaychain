import { transferProperty } from "../api/landApi";

export default function Transfer() {
  const handleTransfer = async () => {
    await transferProperty("PROP-001", {
      from: "Ramesh Kumar",
      to: "New Owner",
      price: 6000000
    });

    alert("Transfer done");
  };

  return (
    <button onClick={handleTransfer}>
      Transfer Property
    </button>
  );
}