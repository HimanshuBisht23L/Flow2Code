import {
  Hand,
  MousePointer,
  Square,
  Circle,
  Diamond,
  Eraser,
} from "lucide-react";

// Custom Parallelogram Icon
const Parallelogram = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="6 3 20 3 14 21 0 21" />
  </svg>
);

// Custom Hexagon Icon
const Hexagon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="6 3 18 3 23 12 18 21 6 21 1 12" />
  </svg>
  
);

const tools = [
  { id: "hand", icon: <Hand size={18} /> },
  { id: "pointer", icon: <MousePointer size={18} /> },
  { id: "rectangle", icon: <Square size={18} stroke="1" />, shape: true },
  { id: "circle", icon: <Circle size={18} />, shape: true },
  { id: "parallelogram", icon: <Parallelogram />, shape: true },
  { id: "diamond", icon: <Diamond size={18} />, shape: true },
  { id: "hexagon", icon: <Hexagon />, shape: true },
  { id: "eraser", icon: <Eraser size={18} />, eraser: true },
];

export default function MinimalToolbar({ setSelectedShape, setShape, sendFlowBackend, setpressdelete, setActiveTool, activeTool }) {

  const handleClick = (tool) => {
    setActiveTool(tool.id);  

    if (tool.shape) {
      setSelectedShape(true);
      setShape(tool.id);
    }
    if (tool.eraser) {
      setpressdelete(true);
    }
  };



  return (
    <div className="flex justify-between items-center mt-4">
      <button className="hover:transform hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 ease-in-out cursor-pointer self-start bg-amber-300 p-[.6rem] rounded-2xl ml-[1rem]" >HAMBurger</button>
      <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow border border-gray-200 w-fit mx-auto ">
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
      <button className="hover:transform hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 ease-in-out cursor-pointer self-start bg-amber-300 p-[.6rem] rounded-2xl mr-[1rem]" onClick={sendFlowBackend}>Code</button>
    </div>
  );
}

