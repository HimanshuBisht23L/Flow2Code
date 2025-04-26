import {
  EraserIcon,
  ParallelogramIcon,
  DiamondIcon,
  Hold03Icon,
  Cursor02Icon,
  OvalIcon,
  SquareIcon,
  HexagonIcon,
  ArrowDownDoubleIcon,
  ArrowUpDoubleIcon
} from "hugeicons-react";

const tools = [
  { id: "hand", icon: <Hold03Icon color="#000" />, hold: true },
  // { id: "edge", label: "Edge", icon: <LinerIcon color="#000" />, edge: true },
  { id: "pointer", icon: <Cursor02Icon color="#000" />, pointer: true },
  { id: "circle", icon: <OvalIcon color="#000" />, shape: true },
  { id: "rectangle", icon: <SquareIcon color="#000" />, shape: true },
  { id: "parallelogram", icon: <ParallelogramIcon color="#000" />, shape: true },
  { id: "diamond", icon: <DiamondIcon color="#000" />, shape: true },
  { id: "hexagon", icon: <HexagonIcon color="#000" />, shape: true },
  { id: "eraser", icon: <EraserIcon color="#000" />, eraser: true },
];




export default function MinimalToolbar({ setSelectedShape, setShape, sendFlowBackend, setIsEraserActive, setActiveTool, activeTool, setShowEditor, showEditor}) {

  const handleClick = (tool) => {
    setActiveTool(tool.id);

    if (tool.shape) {
      setSelectedShape(true);
      setShape(tool.id);
      setIsEraserActive(false);
    } else if (tool.pointer || tool.hand) {
      setIsEraserActive(false);
    } else if (tool.eraser) {
      setIsEraserActive(true);
    }
  };


  const editorCode = () => {
    setShowEditor(!showEditor)
    sendFlowBackend();
  }


  return (
    <div className="flex justify-between items-center mt-4 z-10">
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
      <button className="rotate-[90deg] z-999 hover:transform hover:scale-[1.05] hover:right-[-0%] active:scale-[0.98] transition-all duration-300 ease-in-out cursor-pointer self-start bg-amber-300 p-[.6rem] rounded-2xl absolute top-[45%] right-[-1%] pt-[1rem]" onClick={() => editorCode()}>{!showEditor ? <ArrowDownDoubleIcon color="#000" /> : <ArrowUpDoubleIcon color="#000" />}</button>

    </div>
  );
}
