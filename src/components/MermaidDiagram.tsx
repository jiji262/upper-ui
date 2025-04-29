"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  zoomingEnabled?: boolean;
}

const MermaidDiagram = ({ chart, zoomingEnabled = true }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
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
    });

    const initializePanZoom = async () => {
      const svgElement = containerRef.current?.querySelector("svg");
      if (svgElement && zoomingEnabled) {
        svgElement.style.maxWidth = "none";
        svgElement.style.width = "100%";
        svgElement.style.height = "100%";

        if (zoomingEnabled) {
          try {
            const svgPanZoom = (await import("svg-pan-zoom")).default;
            svgPanZoom(svgElement, {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 10,
              zoomScaleSensitivity: 0.3,
            });
          } catch (error) {
            console.error("Failed to load svg-pan-zoom:", error);
          }
        }
      }
    };

    mermaid.contentLoaded();
    setTimeout(() => {
      void initializePanZoom();
    }, 100);
  }, [chart, zoomingEnabled]);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-full ${zoomingEnabled ? "h-[600px]" : ""}`}
    >
      <div
        key={`${chart}-${zoomingEnabled}`}
        className="mermaid h-full"
      >
        {chart}
      </div>
    </div>
  );
};

export default MermaidDiagram; 