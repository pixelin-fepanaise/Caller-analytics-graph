import * as d3 from "d3";

// Function to setup hover, drag, and click behavior
export function NodeInteractions(svg, simulation) {
  // Select all <circle> elements as nodes and <line> elements as links
  const nodes = svg.selectAll("circle");
  const links = svg.selectAll("line");

  // Variable to track the clicked state and the currently active node
  let isClicked = false;
  let draggedNode = null; // Variable to track the currently active node
  let fixedNode = null; // Variable to track the currently fixed node

  // Define the hover behavior
  function highlightOn(node) {
    const nodeId = node.id;

    // Find all nodes connected to the hovered node (either as source or target)
    const connectedNodes = new Set();
    links.each((d) => {
      if (d.source.id === nodeId) connectedNodes.add(d.target.id);
      if (d.target.id === nodeId) connectedNodes.add(d.source.id);
    });

    // Add the hovered node itself to the set
    connectedNodes.add(nodeId);

    // Set the radius of the hovered node and reduce opacity of unrelated nodes
    nodes
      .attr("r", (d) => (d.id === nodeId ? 8 : 7)) // increase radius for the hovered node
      .style("opacity", (d) => (connectedNodes.has(d.id) ? 1 : 0.15)); // set opacity for connected nodes

    // Set opacity for links related to the hovered node
    links.style(
      "opacity",
      (d) => (d.source.id === nodeId || d.target.id === nodeId ? 0.8 : 0.15) // reduce opacity for unrelated links
    );
  }

  // Function to reset highlighting
  function highlightOff() {
    nodes
      .attr("r", 7) // reset radius
      .style("opacity", 1); // reset opacity for all nodes

    links.style("opacity", 0.4); // reset opacity for all links
  }

  // Helper function to unfix the previously fixed node
  function unfixNode() {
    if (fixedNode) {
      fixedNode.fx = null;
      fixedNode.fy = null;
      fixedNode = null;
    }
  }

  // Drag behavior
  const dragHandler = d3
    .drag()
    .on("start", function (event, d) {
      unfixNode(); // Unfix the previously fixed node, if any
      draggedNode = d;
      highlightOn(d); // Ensure the active node is highlighted
      d.fx = d.x;
      d.fy = d.y;
      // Start simulation if not active
      if (!event.active) simulation.alphaTarget(0.3).restart();
    })
    .on("drag", function (event, d) {
      d.fx = event.x; // Update node position as it's being dragged
      d.fy = event.y;
    })
    .on("end", function (event, d) {
      fixedNode = d; // Set the dragged node as the fixed node
      d.fx = d.x; // Fix the node in place after dragging ends
      d.fy = d.y;

      if (!event.active) simulation.alphaTarget(0);
    });

  // Click behavior
  function nodeClick(event, d) {
    if (!event.active) simulation.alphaTarget(0.05).restart();

    isClicked = true;
    highlightOn(d); // Ensure the active node is highlighted
    draggedNode = null;

    // Prevent the SVG background click from firing
    event.stopPropagation();
  }

  // Attach the event listeners to the nodes
  nodes
    .on("mouseover", function (event, d) {
      if (!isClicked && !draggedNode) {
        // Only highlight on hover if not clicked or dragged and if no node is active
        highlightOn(d);
      }
    })
    .on("mouseout", function () {
      if (!isClicked && !draggedNode) {
        // Only reset if not clicked or dragged and no node is active
        highlightOff();
      }
    })
    .on("click", nodeClick); // Handle click on nodes

  // Apply drag behavior to nodes
  dragHandler(nodes);

  // Add a click event listener to the SVG to release the fixed node, reset highlighting, and stabilize simulation when clicking on the background
  svg.on("click", function (event) {
    highlightOff(); // Reset the highlighting
    isClicked = false;
    draggedNode = null;
    // Stabilize the simulation when clicking on the background
    if (!event.active) simulation.alphaTarget(0); // Reset the alpha target to stop the simulation
  });
}
