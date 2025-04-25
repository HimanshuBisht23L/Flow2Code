import { Background, Controls, Handle, MarkerType, NodeResizer } from '@xyflow/react'
import React, { useCallback, useState, useEffect } from 'react'
import '../styles/Projectpage.css'
import '@xyflow/react/dist/style.css';
import Navbar from './Navbar2.jsx';

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
    const [pressdelete, setpressdelete] = useState(false)
    const [nodeSelect, setnodeSelect] = useState(null)
    const [activeTool, setActiveTool] = useState("pointer");


    const [editingNode, setEditingNode] = useState(null);

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

    useEffect(() => {
        if (!pressdelete) return;

        const selectedNodeIds = [];
        const newNodes = [];
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].selected) {
                selectedNodeIds.push(nodes[i].id);
            } else {
                newNodes.push(nodes[i]);
            }
        }

        const newEdges = [];
        for (let i = 0; i < edges.length; i++) {
            const e = edges[i];
            const isSelected = e.selected;
            const isConnected = selectedNodeIds.includes(e.source) || selectedNodeIds.includes(e.target);
            if (!isSelected && !isConnected) {
                newEdges.push(e);
            }
        }

        setNodes(newNodes);
        setEdges(newEdges);
        setpressdelete(false);
    }, [pressdelete]);


    const NodeClicked = (event, node) => {
        setnodeSelect(node.id);
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

            <div>
                <Navbar
                    setSelectedShape={setSelectedShape}
                    setShape={setshape}
                    sendFlowBackend={sendFlowBackend}
                    setpressdelete={setpressdelete}
                    setActiveTool={setActiveTool}
                    activeTool={activeTool}
                />


                <div style={{ width: "100%", height: "91vh", padding: "1px" }} >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onPaneClick={makeNode}
                        nodeTypes={nodetype}
                        onNodeDoubleClick={onDoubleClick}
                        onNodeClick={NodeClicked}
                        panOnDrag={activeTool !== "pointer"}
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

