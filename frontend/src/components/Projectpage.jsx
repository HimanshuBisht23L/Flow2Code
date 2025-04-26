import { Background, Controls, Handle, MarkerType, NodeResizer } from '@xyflow/react'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import '../styles/Projectpage.css'
import '@xyflow/react/dist/style.css';
import Navbar from './Navbar2.jsx';

import Editor from '@monaco-editor/react';

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
    const [nodeSelect, setnodeSelect] = useState(null)
    const [activeTool, setActiveTool] = useState("pointer");
    const [editingNode, setEditingNode] = useState(null);
    const [isEraserActive, setIsEraserActive] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedLang, setSelectedLang] = useState("javascript");





    const changetoolpath = () => {
        setSelectedShape(!selectedshape)
    }

    const onConnect = useCallback(
        (params) => {
            const styledEdge = {
                ...params,
                type: 'smoothstep',
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
            data: { label: `Node ${i}`, shape: shape, id: i.toString() },
            type: "custom"
        };

        setNodes((prev) => [...prev, newnode]);

        setSelectedShape(false);
        setshape("");
        setActiveTool("pointer");
        i++

    }, [setNodes, shape, selectedshape])


    const nodetype = {
        custom: ({ data, selected }) => {
            return (
                <>
                    <NodeResizer
                        color="#7f56d9"
                        isVisible={selected}
                        minWidth={160}
                        minHeight={50}
                    />

                    <div className={`${nodeSelect === data.id ? 'AddBorder' : ''} nowheel custom-node ${data.shape}`}>

                        <Handle style={data.shape === "diamond" ? { top: "-19%" } : {}} type="source" position={Position.Top} id="t-source" isConnectableStart={true} isConnectableEnd={false} />
                        <Handle style={data.shape === "diamond" ? { top: "-19%" } : {}} type="target" position={Position.Top} id="t-target" isConnectableStart={false} isConnectableEnd={true} />

                        <Handle style={data.shape === "diamond" ? { left: "-19%" } : {}} type="source" position={Position.Left} id="l-source" isConnectableStart={true} isConnectableEnd={false} />
                        <Handle style={data.shape === "diamond" ? { left: "-19%" } : {}} type="target" position={Position.Left} id="l-target" isConnectableStart={false} isConnectableEnd={true} />

                        <Handle style={data.shape === "diamond" ? { bottom: "-19%" } : {}} type="source" position={Position.Bottom} id="b-source" isConnectableStart={true} isConnectableEnd={false} />
                        <Handle style={data.shape === "diamond" ? { bottom: "-19%" } : {}} type="target" position={Position.Bottom} id="b-target" isConnectableStart={false} isConnectableEnd={true} />

                        <Handle style={data.shape === "diamond" ? { right: "-19%" } : {}} type="source" position={Position.Right} id="r-source" isConnectableStart={true} isConnectableEnd={false} />
                        <Handle style={data.shape === "diamond" ? { right: "-19%" } : {}} type="target" position={Position.Right} id="r-target" isConnectableStart={false} isConnectableEnd={true} />

                        {
                            editingNode === data.id ? (
                                <input
                                    autoFocus
                                    type="text"
                                    value={data.label}
                                    className='node-input'
                                    onChange={(e) => {
                                        const newinsideData = e.target.value;
                                        setNodes((prev) =>
                                            prev.map((node) =>
                                                node.id === data.id
                                                    ? { ...node, data: { ...node.data, label: newinsideData } }
                                                    : node
                                            )
                                        );
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") setEditingNode(null);
                                    }}
                                />
                            ) : (
                                <div className='data'>{data.label}</div>
                            )
                        }
                    </div>
                </>
            );
        }
    }


    const onDoubleClick = useCallback(
        (event, node) => {
            event.stopPropagation(); //stop bubbling
            setEditingNode(node.id)
        }
    )


    const eraserActiveRef = useRef(isEraserActive);

    useEffect(() => {
        eraserActiveRef.current = isEraserActive;
    }, [isEraserActive]);



    const onEdgesChangeWrapper = useCallback((changes) => {
        onEdgesChange(changes); // simple, no special eraser logic here
    }, [onEdgesChange]);


    const onEdgeClick = useCallback((event, edge) => {
        if (eraserActiveRef.current) {
            event.stopPropagation(); // prevent selecting it
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
    }, [setEdges]);





    const onNodesChangeWrapper = useCallback((changes) => {
        if (isEraserActive) {
            const selectedNodeIds = [];

            // Collect selected node IDs
            changes.forEach((change) => {
                if (change.type === 'select' && change.selected) {
                    selectedNodeIds.push(change.id);
                }
            });

            if (selectedNodeIds.length > 0) {
                // Delete selected nodes and their corresponding edges
                setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));
                setEdges((eds) => eds.filter((edge) =>
                    !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
                ));
            }
        } else {
            onNodesChange(changes);
        }
    }, [isEraserActive, onNodesChange, setNodes, setEdges]);



    useEffect(() => {
        if (!isEraserActive) return;

        const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
        if (selectedNodeIds.length === 0) return;

        // Remove selected nodes
        setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));

        // Remove edges connected to deleted nodes
        setEdges((eds) =>
            eds.filter((e) =>
                !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)
            )
        );

    }, [nodes, edges, isEraserActive]);


    const NodeClicked = (event, node) => {
        if (isEraserActive) {
            // Delete clicked node and its connected edges
            setNodes((nds) => nds.filter((n) => n.id !== node.id));
            setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
            // Eraser remains active until user changes
        } else {
            setnodeSelect(node.id);
        }
    };


    // Send Json data to backend
    const sendFlowBackend = async () => {
        const data = reteriveData();

        const nodeConnections = {};

        // connection array
        edges.forEach(edge => {
            if (!nodeConnections[edge.source]) {
                nodeConnections[edge.source] = [];
            }
            nodeConnections[edge.source].push(edge.target);
        });

        const DataSend = data.map(({ id, data, position }) => ({
            id,
            label: data.label,
            shape: data.shape,
            position,
            connections: nodeConnections[id] || []
        }));

        try {
            const res = await axios.post("http://localhost:3000/recieve", DataSend);
            console.log(res.data || "✅ Sent successfully");
        } catch (error) {
            console.log("❌ Not Sent Successfully", error.message);
        }
    };



    const reteriveData = () => {
        const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));  // node object created
        const incommingMapEdge = {}
        edges.forEach((edge) => {
            incommingMapEdge[edge.target] = (incommingMapEdge[edge.target] || 0) + 1;
        })

        const startNodes = nodes.filter((node) => !incommingMapEdge[node.id])


        const New_Data = []
        const visited = [];
        const DFS = (start) => {
            if (visited[start]) {
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

        startNodes.forEach((node) => DFS(node.id));
        return New_Data;
    }



    return (
        <>
            {!selectedshape && (
                <div className="absolute top-0 left-0 w-full h-screen bg-black/30  flex items-center justify-center">
                    <p className="text-white text-xl font-semibold">Click a tool to get started</p>
                </div>
            )}


            <div className='relative mainbody bg-[#aaaaaa61]'>

                <Navbar
                    setSelectedShape={setSelectedShape}
                    setShape={setshape}
                    sendFlowBackend={sendFlowBackend}
                    setActiveTool={setActiveTool}
                    setIsEraserActive={setIsEraserActive}
                    activeTool={activeTool}
                    setShowEditor={setShowEditor}
                />


                <div className='absolute flex flex-col gap-2 bg-amber-300 w-[40%] h-[70%] z-20 rounded-2xl top-[15%] right-0'>

                    <div className='bg-red-200 border-2 p-1 rounded-2xl'>
                        <select
                            onClick={changetoolpath}
                            name="Language"
                            id="lang-select"
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                        </select>

                    </div>

                    <div className='relative w-[100%] h-[100%]'>
                        <Editor
                            theme='vs-dark'
                            height="100%"
                            width="100%"
                            language={selectedLang}
                            defaultValue="// some comment"
                        />;
                    </div>

                </div>



                <div style={{ width: "100%", height: "89vh", padding: "1px" }} >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        selectNodesOnDrag={true}
                        selectionOnDrag
                        onNodesChange={onNodesChangeWrapper}
                        onEdgesChange={onEdgesChangeWrapper}
                        onConnect={onConnect}
                        onPaneClick={makeNode}
                        nodeTypes={nodetype}
                        onNodeDoubleClick={onDoubleClick}
                        onNodeClick={NodeClicked}
                        panOnDrag={activeTool !== "pointer"}
                        onEdgeClick={onEdgeClick}
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



