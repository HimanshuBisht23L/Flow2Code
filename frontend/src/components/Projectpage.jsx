import { Background, Controls, Handle, MarkerType } from '@xyflow/react'
import React, { useCallback, useState } from 'react'
import '../styles/Projectpage.css'
import '@xyflow/react/dist/style.css';
import {
    MiniMap,
    ReactFlow,
    useNodesState,
    useEdgesState,
    Position,
    addEdge,
} from '@xyflow/react';
import axios from 'axios';


let i = 1;
const initialNodes = [];
const initialEdges = [];


export default function Projectpage() {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedshape, setSelectedShape] = useState(false)
    const [shape, setshape] = useState("")

    const onConnect = useCallback(
        (params) => {
            const styledEdge = {
                ...params,
                type: 'step',
                style: { stroke: 'black', strokeWidth: 1 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                }
            };
            setEdges((eds) => addEdge(styledEdge, eds));
        },
        [setEdges]
    );


    const makeNode = useCallback((event) => {

        if (!selectedshape) {
            return
        }

        const bounds = event.target.getBoundingClientRect();
        const position = {
            x: event.clientX - bounds.left - 55,
            y: event.clientY - bounds.top - 25
        }

        const newnode = {
            id: i.toString(),
            position: {
                x: position.x,
                y: position.y,
            },
            data: { label: `Node ${i}`, shape: shape },
            type: "custom"
        };

        setNodes((prev) => [...prev, newnode]);
        i++

    }, [setNodes, shape, selectedshape])


    const nodetype = {
        custom: ({ data }) => {
            return (
                <>
                    <Handle style={data.shape === "diamond" ? { top: "-19%" } : {}} type="source" position={Position.Top} id="t-source" isConnectableStart={true} isConnectableEnd={false} />
                    <Handle style={data.shape === "diamond" ? { top: "-19%" } : {}} type="target" position={Position.Top} id="t-target" isConnectableStart={false} isConnectableEnd={true} />

                    <Handle style={data.shape === "diamond" ? { left: "-19%" } : {}} type="source" position={Position.Left} id="l-source" isConnectableStart={true} isConnectableEnd={false} />
                    <Handle style={data.shape === "diamond" ? { left: "-19%" } : {}} type="target" position={Position.Left} id="l-target" isConnectableStart={false} isConnectableEnd={true} />

                    <Handle style={data.shape === "diamond" ? { bottom: "-19%" } : {}} type="source" position={Position.Bottom} id="b-source" isConnectableStart={true} isConnectableEnd={false} />
                    <Handle style={data.shape === "diamond" ? { bottom: "-19%" } : {}} type="target" position={Position.Bottom} id="b-target" isConnectableStart={false} isConnectableEnd={true} />

                    <Handle style={data.shape === "diamond" ? { right: "-19%" } : {}} type="source" position={Position.Right} id="r-source" isConnectableStart={true} isConnectableEnd={false} />
                    <Handle style={data.shape === "diamond" ? { right: "-19%" } : {}} type="target" position={Position.Right} id="r-target" isConnectableStart={false} isConnectableEnd={true} />

                    <div className={`custom-node ${data.shape}`}>
                        <div className='data'>{data.label}</div>
                    </div>
                </>
            );
        }
    }


    const onNodeClick = useCallback(
        (event, node) => {
            event.stopPropagation(); //stop bubbling

            const newLabel = prompt('Enter new label for this node:', node.data.label);
            if (newLabel !== null) {
                setNodes((prev) =>
                    prev.map((n) =>
                        n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
                    )
                );
            }
        },
        [setNodes]
    );

    const sendFlowBackend = async () => {
        const data = reteriveData();
        // console.log(Datasend);
        const DataSend = data.map(({id, data, position})=> ({
            id,
            label :  data.label,
            shape : data.shape,
            position

        }))

        try {
            const res = await axios.post("http://localhost:3000/recieve", DataSend)
            console.log(res)
        } catch (Error) {
            console.log("❌ Not Send SuccessFully")
        }
    }


    const reteriveData = () => {
        const nodeMap = Object.fromEntries(nodes.map((node)=> [node.id, node]));  // node object created
        const incommingMapEdge = {}
        edges.forEach((edge)=>{
            incommingMapEdge[edge.target] = (incommingMapEdge[edge.target] || 0) + 1;
        })

        const startNodes = nodes.filter((node)=> !incommingMapEdge[node.id])
        

        const New_Data = []
        const visited = [];
        const DFS = (start)=>{
            if(visited[start]){
                return
            }

            visited[start] = true;
            New_Data.push(nodeMap[start])

            for (let i = 0; i < edges.length; i++) {
                if (edges[i].source == start) {
                    DFS(edges[i].target);
                }
            }
        }

        startNodes.forEach((node)=> DFS(node.id));
        return New_Data;
    }


    return (
        <>

            <div>
                <nav className='h-[9vh] bg-[#f0f0f0] flex justify-between items-center pl-[2rem] pr-[4rem]'>
                    <div className='flex gap-[1.5rem]'>
                        <strong>Select Shape : </strong>
                        <ul className='list-none flex gap-[3rem]'>
                            <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setshape("circle") }}>Circle</li>
                            <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setshape("rectangle") }}>Rectangle</li>
                            <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setshape("parallelogram") }}>Parallelogram</li>
                            <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setshape("diamond") }}>Diamond</li>
                            <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setshape("hexagon") }}>hexagon</li>
                        </ul>
                    </div>
                    <div>
                        <button onClick={sendFlowBackend} className='cursor-pointer text-blue-500 hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out'>🚀 Get Code</button>
                    </div>
                </nav>

                <div style={{ width: "100%", height: "91vh", padding: "1px" }} >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onPaneClick={makeNode}
                        nodeTypes={nodetype}
                        onNodeClick={onNodeClick}
                    >
                        <MiniMap />
                        <Background variant='plain' />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
        </>
    )
}




// const nodetype = {
//     custom: ({ data }) => {
//         return (
//             <div className={`custom-node ${data.shape}`}>
//                 <div className="dot">
//                     <Handle style={data.shape === "diamond" ? { top: "-22%", left: "47%" } : {}} type="source" position={Position.Top} id="t-source" />
//                     <Handle style={data.shape === "diamond" ? { top: "-22%", left: "47%" } : {}} type="target" position={Position.Top} id="t-target" />

//                     <Handle style={data.shape === "diamond" ? { left: "-22%", top: "47%" } : {}} type="source" position={Position.Left} id="l-source" />
//                     <Handle style={data.shape === "diamond" ? { left: "-22%", top: "47%" } : {}} type="target" position={Position.Left} id="l-target" />

//                     <Handle style={data.shape === "diamond" ? { bottom: "-22%", left: "47%" } : {}} type="source" position={Position.Bottom} id="b-source" />
//                     <Handle style={data.shape === "diamond" ? { bottom: "-22%", left: "47%" } : {}} type="target" position={Position.Bottom} id="b-target" />

//                     <Handle style={data.shape === "diamond" ? { right: "-22%", top: "47%" } : {}} type="source" position={Position.Right} id="r-source" />
//                     <Handle style={data.shape === "diamond" ? { right: "-22%", top: "47%" } : {}} type="target" position={Position.Right} id="r-target" />
//                 </div>

//                 <div className='data'>{data.label}</div>
//             </div>
//         );
//     }
// }




// const initialNodes = [
//     { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//     { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{
//     id: 'e1-2', type: "step", source: '1', target: '2',
//     markerEnd: {
//         type: MarkerType.Arrow
//     },
//     style: { stroke: "Blue" }
// }];