import {
  EraserIcon,
  ParallelogramIcon,
  DiamondIcon,
  Hold03Icon,
  Cursor02Icon,
  OvalIcon,
  SquareIcon,
  HexagonIcon
} from "hugeicons-react";

const tools = [
  { id: "hand", icon: <Hold03Icon color="#000" />, hold: true },
  { id: "pointer", icon: <Cursor02Icon color="#000" />, pointer: true },
  { id: "circle", icon: <OvalIcon color="#000" />, shape: true },
  { id: "rectangle", icon: <SquareIcon color="#000" />, shape: true },
  { id: "parallelogram", icon: <ParallelogramIcon color="#000" />, shape: true },
  { id: "diamond", icon: <DiamondIcon color="#000" />, shape: true },
  { id: "hexagon", icon: <HexagonIcon color="#000" />, shape: true },
  { id: "eraser", icon: <EraserIcon color="#000" />, eraser: true },
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
                ? "bg-indigo-200 text-indigo-600"
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

