import "./App.css";
import Header from "./components/Header";
import Paragraph from "./components/Paragraph";
import Dropdown from "./components/Dropdown";
import NetworkGraph from "./components/NetworkGraph";
import ChatButton from "./components/ChatButton";
import { useState } from "react";

function App() {
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Paragraph />
        <div className="graph-content">
          <Dropdown onCommunitySelect={setSelectedCommunity} />
          <NetworkGraph selectedCommunity={selectedCommunity} />
        </div>
      </div>
      <ChatButton />
    </div>
  );
}

export default App;
