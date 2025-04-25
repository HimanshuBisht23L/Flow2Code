import { useState } from "react";
import {
  Hold03Icon,
  ParallelogramIcon,
  DiamondIcon,
  SquareIcon,
  CircleIcon,
  HexagonIcon,
  Cursor02Icon,
  EraserIcon,
} from "hugeicons-react";


const tools = [
  { id: "hand", icon: <Hold03Icon color="#000" />, hold: true },
  { id: "pointer", icon: <Cursor02Icon color="#000" />, pointer: true },
  { id: "circle", icon: <CircleIcon color="#000" />, shape: true },
  { id: "rectangle", icon: <SquareIcon color="#000" />, shape: true },
  { id: "parallelogram", icon: <ParallelogramIcon color="#000" />, shape: true },
  { id: "diamond", icon: <DiamondIcon color="#000" />, shape: true },
  { id: "hexagon", icon: <HexagonIcon color="#000" />, shape: true },
  { id: "eraser", icon: <EraserIcon color="#000" />, eraser: true },
];

export default function MinimalToolbar({ setSelectedShape, setShape, sendFlowBackend }) {
  const [activeTool, setActiveTool] = useState("pointer");

  const handleClick = (tool) => {
    setActiveTool(tool.id);
    if (tool.shape) {
      setSelectedShape(true);
      setShape(tool.id);
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl shadow border border-gray-200 w-fit mx-auto mt-4">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => handleClick(tool)}
          className={`p-2 rounded-lg transition-all relative
            ${activeTool === tool.id
              ? "bg-indigo-100 text-indigo-600"
              : "hover:bg-gray-100"}
          `}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
