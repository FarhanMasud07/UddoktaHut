"use client"; // ✅ This makes it a Client Component

import { useState } from "react";

export default function CreateShopForm() {
  const [shopName, setShopName] = useState("");
  const [shopURL, setShopURL] = useState(null);
  const [error, setError] = useState(null);

  async function createShop() {
    setError(null);
    setShopURL(null);

    if (!shopName.trim()) {
      setError("Please enter a shop name.");
      return;
    }

    const res = await fetch("/api/createShop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopName }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setShopURL(data.shopURL);
  }

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <input
        type="text"
        placeholder="Enter your shop name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
      />
      <button onClick={createShop}>Create My Shop</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {shopURL && (
        <p>
          ✅ <strong>Your shop is ready!</strong>
          <br />
          <a href={shopURL} target="_blank" rel="noopener noreferrer">
            {shopURL}
          </a>
        </p>
      )}
    </div>
  );
}
