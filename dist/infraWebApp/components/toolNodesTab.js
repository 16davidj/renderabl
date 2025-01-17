"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolNodesPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material"); // Import Material-UI's Delete icon
const defaultSchema = `{
    "agentName": "SampleAgent",
    "agentArgs": {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"field1":{"type":"string"}, "field2":{"type":"string"}}, "required":["field1"], "additionalProperties": false},
    "agentDescription": "Insert description here"
}`;
function* renderToolNodes(toolNodes, handleDeleteNode) {
    let index = 0;
    for (let node of toolNodes) {
        yield ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                border: '1px solid #000',
                padding: '1rem',
                borderRadius: '8px',
                minWidth: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#f9f9f9',
                position: 'relative', // For positioning the trash icon
            }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "subtitle1", children: ["Name: ", node.function.name] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body1", children: ["Description: ", node.function.description] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "subtitle2", children: ["Parameters: ", JSON.stringify(node.function.parameters)] }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDeleteNode(node), sx: {
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#fff',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        },
                    }, children: (0, jsx_runtime_1.jsx)(icons_material_1.Delete, {}) })] }, index++));
    }
}
function ToolNodesPage() {
    const [toolNodes, setToolNodes] = (0, react_1.useState)(new Set());
    const [newNodeSchema, setNewNodeSchema] = (0, react_1.useState)(defaultSchema);
    const [prompt, setPrompt] = (0, react_1.useState)('');
    const [decision, setDecision] = (0, react_1.useState)(null);
    // Fetch existing tool nodes on page load
    (0, react_1.useEffect)(() => {
        fetch('http://localhost:5500/api/getToolGraph')
            .then((res) => res.json())
            .then((data) => setToolNodes(new Set(data))) // Ensure to parse data correctly as Set
            .catch((err) => console.error('Error fetching tool nodes:', err));
    }, []);
    const handleAddNode = () => {
        try {
            const schema = JSON.parse(newNodeSchema);
            fetch('http://localhost:5500/api/writeToolNode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schema),
            })
                .then((res) => res.json())
                .then((data) => {
                setToolNodes((prev) => new Set([...prev, data])); // Add new node to the shelf
                setNewNodeSchema(defaultSchema); // Reset input field
            })
                .catch((err) => console.error('Error adding tool node:', err));
        }
        catch (error) {
            console.error('Invalid JSON Schema:', error);
        }
    };
    const handleDeleteNode = (node) => {
        // Remove node from the Set in the state
        setToolNodes((prev) => {
            const updatedSet = new Set(prev);
            updatedSet.delete(node); // Remove node by its ID
            return updatedSet;
        });
        // Trigger the POST request to update the backend
        fetch('http://localhost:5500/api/writeToolGraph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Array.from(toolNodes)), // Send the updated toolNodes as an array
        })
            .then((res) => res.json())
            .then((data) => console.log('Tool Graph updated:', data))
            .catch((err) => console.error('Error updating tool graph:', err));
    };
    const handleSendPrompt = () => {
        fetch('http://localhost:5500/api/getFunctionCallDecision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt }),
        })
            .then((res) => res.json())
            .then((data) => setDecision(data))
            .catch((err) => console.error('Error sending prompt:', err));
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "lg", style: { marginTop: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, children: "Tool Nodes Interface" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Tool Nodes" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                            display: 'flex',
                            gap: '1rem',
                            overflowX: 'auto',
                            padding: '0.5rem',
                        }, children: [[...renderToolNodes(toolNodes, handleDeleteNode)], " "] })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, border: '1px solid #ccc', padding: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Add a New Tool Node" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "JSON Schema", multiline: true, rows: 8, value: newNodeSchema, onChange: (e) => setNewNodeSchema(e.target.value), fullWidth: true, variant: "outlined" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleAddNode, style: { marginTop: '1rem' }, children: "Add Node" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, border: '1px solid #ccc', padding: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Send a Prompt" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Prompt", multiline: true, rows: 4, value: prompt, onChange: (e) => setPrompt(e.target.value), fullWidth: true, variant: "outlined" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSendPrompt, style: { marginTop: '1rem' }, children: "Send" }), decision && ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { marginTop: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Decision:" }), (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(decision, null, 2) })] }))] })] })] }));
}
//# sourceMappingURL=toolNodesTab.js.map