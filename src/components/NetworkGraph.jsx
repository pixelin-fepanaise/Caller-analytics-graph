import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { RenderGraph } from "./RenderGraph";
import "./NetworkGraph.css";

const NetworkGraph = ({ selectedCommunity }) => {
  const [nodesData, setNodesData] = useState(null);
  const [relationshipsData, setRelationshipsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const graphRef = useRef();
  const simulationRef = useRef();

  // Fetch and store all data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const nodesResponse = await fetch(
          "https://cdwa5g3mxi.execute-api.us-east-1.amazonaws.com/large-node/get-cdr-data-nodes-api"
        );
        const nodesResult = await nodesResponse.json();
        const nodesData = JSON.parse(nodesResult.body);
        setNodesData(nodesData);

        const relationshipsResponse = await fetch(
          "https://ymc09ocx88.execute-api.us-east-1.amazonaws.com/large-prd/get-cdr-data-relationships-api"
        );
        const relationshipsResult = await relationshipsResponse.json();
        const relationshipsData = JSON.parse(relationshipsResult.body);
        setRelationshipsData(relationshipsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading after data is fetched
      }
    };

    fetchData();
  }, []);

  // Render or update the graph when selectedCommunity changes
  useEffect(() => {
    if (selectedCommunity && nodesData && relationshipsData) {
      // Extract community-specific data
      const communityNodes = nodesData[selectedCommunity]?.nodes || [];
      const communityRelationships =
        relationshipsData[selectedCommunity]?.[selectedCommunity] || [];

      // Format nodes and links
      const nodes = communityNodes.map((node) => ({
        id: node.id,
        label: `Id: ${node.id}\nCity: ${node.city}`, // Id and City
      }));

      const links = communityRelationships.map((relation) => ({
        source: relation.from,
        target: relation.to,
      }));

      // Render the graph
      RenderGraph(nodes, links, graphRef, simulationRef);
    }
  }, [selectedCommunity, nodesData, relationshipsData]);

  return (
    <div ref={graphRef} className="network-graph-container">
      {/* Display text based on the state */}
      {!selectedCommunity && <p>Select a community to view graph.</p>}
      {selectedCommunity && isLoading && <p>Graph loading, please wait.</p>}
    </div>
  );
};

NetworkGraph.propTypes = {
  selectedCommunity: PropTypes.string.isRequired,
};

export default NetworkGraph;
