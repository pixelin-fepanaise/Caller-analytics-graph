import * as d3 from "d3";
import { NodeInteractions } from "./NodeInteractions";
import "./RenderGraph.css";

// Function to render the graph
export function RenderGraph(nodes, links, graphRef, simulationRef) {
  const container = d3.select(graphRef.current);
  // Clear any previous SVG elements
  container.selectAll("*").remove();

  // Create an SVG element that fills its parent container
  const svg = container.append("svg").classed("svg-container", true);

  // After appending, get the dimensions of the SVG element
  let width = svg.node().getBoundingClientRect().width;
  let height = svg.node().getBoundingClientRect().height;

  // Initially set width and height as attributes instead of viewBox to avoid scaling
  svg.attr("width", width).attr("height", height);

  // Define a color scale for the nodes
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Set up the simulation
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(() => {
          // Assign a random link length between a minimum and maximum value
          const minDistance = 20;
          const maxDistance = 500;
          return Math.random() * (maxDistance - minDistance) + minDistance;
        })
    )
    .force("charge", d3.forceManyBody().strength(-10))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05));

  simulationRef.current = simulation;

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1)
    .attr("stroke", "#999")
    .attr("opacity", 0.4);

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 7)
    .attr("fill", (d) => colorScale(d.id))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  // Add labels to nodes
  node.append("title").text((d) => d.label);

  // Apply node interactions
  NodeInteractions(svg, simulation);

  // Update node and link positions on each tick of the simulation
  simulation.on("tick", () => {
    nodes.forEach((d) => {
      d.x = Math.max(7, Math.min(width - 7, d.x)); // Keep nodes within horizontal bounds
      d.y = Math.max(7, Math.min(height - 7, d.y)); // Keep nodes within vertical bounds
    });

    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  simulation.nodes(nodes);
  simulation.force("link").links(links);

  // Handle window resizing without resetting node positions
  const handleResize = () => {
    width = svg.node().getBoundingClientRect().width;
    height = svg.node().getBoundingClientRect().height;

    // Update the SVG dimensions without scaling
    svg.attr("width", width).attr("height", height);

    // Update only the forces that are responsible for positioning, not node placement
    simulation.force("center", d3.forceCenter(width / 2, height / 2));
    simulation.force("x", d3.forceX(width / 2).strength(0.05));
    simulation.force("y", d3.forceY(height / 2).strength(0.05));

    // Instead of restarting the simulation, recalculate the forces gently
    simulation.alpha(0.3).restart(); // Just a gentle adjustment
  };

  window.addEventListener("resize", handleResize);

  // Clean up event listener when the component is unmounted
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}
