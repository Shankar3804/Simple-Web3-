import React, { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [feedback, setFeedback] = useState("");
  const [allFeedbacks, setAllFeedbacks] = useState([]);

  useEffect(() => {
    const storedFeedbacks = localStorage.getItem("feedbacks");
    if (storedFeedbacks) {
      setAllFeedbacks(JSON.parse(storedFeedbacks));
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Connection Error:", error);
      }
    } else {
      alert("MetaMask not found. Please install MetaMask.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback) return;

    const newFeedback = {
      address: walletAddress,
      message: feedback,
      timestamp: new Date().toLocaleString(),
    };

    const updatedFeedbacks = [newFeedback, ...allFeedbacks];
    setAllFeedbacks(updatedFeedbacks);
    localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
    setFeedback("");
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📝 Web3 Feedback Board</h1>

        {!walletAddress ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>
            <strong>Connected:</strong> {walletAddress}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button type="submit">Submit Feedback</button>
        </form>

        <h2>Feedbacks:</h2>
        {allFeedbacks.length === 0 ? (
          <p>No feedbacks yet.</p>
        ) : (
          allFeedbacks.map((item, index) => (
            <div key={index} className="feedback">
              <p>
                <strong>
                  {item.address.slice(0, 6)}...{item.address.slice(-4)}
                </strong>
              </p>
              <p>{item.message}</p>
              <p className="timestamp">{item.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
