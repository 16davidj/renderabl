'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolNodesPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const react_material_ui_carousel_1 = __importDefault(require("react-material-ui-carousel"));
function ToolNodesPage() {
    const [toolNodes, setToolNodes] = (0, react_1.useState)([]); // Array of tool nodes
    const [newNodeSchema, setNewNodeSchema] = (0, react_1.useState)('{}'); // JSON Schema input
    const [prompt, setPrompt] = (0, react_1.useState)(''); // User's prompt input
    const [decision, setDecision] = (0, react_1.useState)(null); // Decision JSON
    // Fetch existing tool nodes on page load
    (0, react_1.useEffect)(() => {
        fetch('/api/getToolGraph')
            .then((res) => res.json())
            .then((data) => setToolNodes(data))
            .catch((err) => console.error('Error fetching tool nodes:', err));
    }, []);
    const handleAddNode = () => {
        try {
            const schema = JSON.parse(newNodeSchema);
            fetch('/api/writeToolNode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schema),
            })
                .then((res) => res.json())
                .then((data) => {
                setToolNodes((prev) => [...prev, data]); // Add new node to the carousel
                setNewNodeSchema('{}'); // Reset input field
            })
                .catch((err) => console.error('Error adding tool node:', err));
        }
        catch (error) {
            console.error('Invalid JSON Schema:', error);
        }
    };
    const handleSendPrompt = () => {
        fetch('/api/getFunctionCallDecision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        })
            .then((res) => res.json())
            .then((data) => setDecision(data))
            .catch((err) => console.error('Error sending prompt:', err));
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "lg", style: { marginTop: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, children: "Tool Nodes Interface" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Tool Nodes" }), (0, jsx_runtime_1.jsx)(react_material_ui_carousel_1.default, { children: toolNodes.map((node, index) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                                border: '1px solid #000',
                                padding: '1rem',
                                borderRadius: '8px',
                                minHeight: '150px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "subtitle1", children: ["Name: ", node.function.name] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body1", children: ["Description: ", node.function.description] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", children: ["Parameters: ", JSON.stringify(node.function.parameters)] })] }, index))) })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, border: '1px solid #ccc', padding: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Add a New Tool Node" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "JSON Schema", multiline: true, rows: 8, value: newNodeSchema, onChange: (e) => setNewNodeSchema(e.target.value), fullWidth: true, variant: "outlined" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleAddNode, style: { marginTop: '1rem' }, children: "Add Node" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, border: '1px solid #ccc', padding: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Send a Prompt" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Prompt", multiline: true, rows: 4, value: prompt, onChange: (e) => setPrompt(e.target.value), fullWidth: true, variant: "outlined" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSendPrompt, style: { marginTop: '1rem' }, children: "Send" }), decision && ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { marginTop: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Decision:" }), (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(decision, null, 2) })] }))] })] })] }));
}
//# sourceMappingURL=functionDeciderTab.js.map