import { Background, Controls, Handle, MarkerType } from '@xyflow/react'
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


    // Add label/data to node
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


    // delete edge
    const EdgeDelete = useCallback(
        (edgesToRemove) => setEdges((eds) => eds.filter((edge) => !edgesToRemove.includes(edge))),
        [setEdges]
    );


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Delete') {
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
                    const edge = edges[i];

                    const isConnectedToDeletedNode =
                        selectedNodeIds.includes(edge.source) ||
                        selectedNodeIds.includes(edge.target);

                    const isEdgeSelected = edge.selected === true;

                    // not delete node which is not selected
                    if (!isConnectedToDeletedNode && !isEdgeSelected) {
                        newEdges.push(edge);
                    }
                }

                setNodes(newNodes);
                setEdges(newEdges);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [nodes, edges]);


    // Send Json data to backend
    const sendFlowBackend = async () => {
        const data = reteriveData();
        // console.log(Datasend);
        const DataSend = data.map(({ id, data, position }) => ({
            id,
            label: data.label,
            shape: data.shape,
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
                        onNodeClick={onNodeClick}
                        onEdgesDelete={EdgeDelete}
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

