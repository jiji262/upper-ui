"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  zoomingEnabled?: boolean;
}

const MermaidDiagram = ({ chart, zoomingEnabled = true }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [svgPanZoomInstance, setSvgPanZoomInstance] = useState<any>(null);

  // Memoize configuration to prevent unnecessary re-initialization
  const mermaidConfig = useMemo(() => ({
    startOnLoad: true,
    theme: "neutral",
    htmlLabels: true,
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      nodeSpacing: 50,
      rankSpacing: 50,
      padding: 15,
    },
    themeCSS: `
      .node rect, .node circle, .node ellipse, .node polygon {
        fill: #e6d5ff;
        stroke: #000000;
        stroke-width: 2px;
      }
      .edgePath path {
        stroke: #000000;
        stroke-width: 2px;
      }
      .label {
        color: #000000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      .label foreignObject {
        font-size: 14px;
        font-weight: 500;
      }
      #flowchart-pointEnd, #flowchart-pointStart {
        fill: #000000;
      }
      .edgeLabel {
        background-color: #ffffff;
        padding: 4px;
      }
    `,
  }), []);

  // Initialize mermaid once on mount
  useEffect(() => {
    mermaid.initialize(mermaidConfig);
    return () => {
      // Clean up SVG Pan Zoom instance if it exists
      if (svgPanZoomInstance) {
        svgPanZoomInstance.destroy();
        setSvgPanZoomInstance(null);
      }
    };
  }, [mermaidConfig, svgPanZoomInstance]);

  // Handle diagram rendering and pan-zoom initialization
  useEffect(() => {
    // Reset the rendered state when chart changes
    setIsRendered(false);
    
    // Clean up previous SVG Pan Zoom instance if it exists
    if (svgPanZoomInstance) {
      svgPanZoomInstance.destroy();
      setSvgPanZoomInstance(null);
    }
    
    // Render the mermaid diagram when chart changes
    if (containerRef.current) {
      // Use mermaid.render instead of contentLoaded for more reliable rendering
      const renderDiagram = async () => {
        try {
          // Clear any previous diagrams
          const mermaidDiv = containerRef.current?.querySelector(".mermaid");
          if (mermaidDiv) {
            mermaidDiv.innerHTML = chart;
          }
          
          await mermaid.run();
          setIsRendered(true);
        } catch (error) {
          console.error("Failed to render mermaid diagram:", error);
        }
      };
      
      renderDiagram();
    }
  }, [chart, svgPanZoomInstance]);

  // Initialize pan-zoom after diagram is rendered
  useEffect(() => {
    if (isRendered && zoomingEnabled && containerRef.current) {
      const initializePanZoom = async () => {
        const svgElement = containerRef.current?.querySelector("svg");
        if (svgElement) {
          svgElement.style.maxWidth = "none";
          svgElement.style.width = "100%";
          svgElement.style.height = "100%";

          try {
            const svgPanZoom = (await import("svg-pan-zoom")).default;
            const instance = svgPanZoom(svgElement, {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 10,
              zoomScaleSensitivity: 0.3,
            });
            setSvgPanZoomInstance(instance);
          } catch (error) {
            console.error("Failed to load svg-pan-zoom:", error);
          }
        }
      };

      initializePanZoom();
    }
  }, [isRendered, zoomingEnabled]);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-full ${zoomingEnabled ? "h-[600px]" : ""}`}
      data-testid="mermaid-diagram-container"
    >
      <div className="mermaid h-full">
        {chart}
      </div>
    </div>
  );
};

export default MermaidDiagram; 