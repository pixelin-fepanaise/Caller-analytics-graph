import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { RenderGraph } from "./RenderGraph";
import "./NetworkGraph.css";

const NetworkGraph = ({ selectedCommunity }) => {
  const [nodesData, setNodesData] = useState(null);
  const [relationshipsData, setRelationshipsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const graphRef = useRef();
  const simulationRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCommunity && nodesData && relationshipsData) {
      const communityNodes = nodesData[selectedCommunity]?.nodes || [];
      const communityRelationships =
        relationshipsData[selectedCommunity]?.[selectedCommunity] || [];

      const nodes = communityNodes.map((node) => ({
        id: node.id,
        label: `Id: ${node.id}\nCity: ${node.city}`,
      }));

      const links = communityRelationships.map((relation) => ({
        source: relation.from,
        target: relation.to,
      }));

      RenderGraph(nodes, links, graphRef, simulationRef);
    }
  }, [selectedCommunity, nodesData, relationshipsData]);

  return (
    <div ref={graphRef} className="network-graph-container">
      {!selectedCommunity && <p>Select a community to view graph.</p>}
      {selectedCommunity && isLoading && <div className="spinner"></div>}
    </div>
  );
};

NetworkGraph.propTypes = {
  selectedCommunity: PropTypes.string.isRequired,
};

export default NetworkGraph;
