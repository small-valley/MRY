import React from "react";

interface GridProps {
  children: React.ReactNode;
}

const Grid = ({ children }: GridProps) => {
  return <div id="gantt-grid-container">{children}</div>;
};

export default Grid;
