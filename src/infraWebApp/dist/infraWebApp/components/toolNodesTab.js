"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolNodesPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material"); // Import Material-UI's Delete icon
const material_2 = require("@mui/material"); // Import the loading spinner
const react_json_prettify_1 = __importDefault(require("react-json-prettify"));
const defaultSchema = `{
    "agentName": "SampleAgent",
    "agentArgs": {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"field1":{"type":"string"}, "field2":{"type":"string"}}, "required":["field1"], "additionalProperties": false},
    "agentDescription": "Insert description here"
}`;
const DecisionDisplay = ({ decision }) => {
    const { functionName, args } = decision;
    console.log(JSON.stringify(decision));
    console.log(functionName);
    console.log(JSON.stringify(args));
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Function Name:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", sx: { mb: 2 }, children: functionName }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Arguments:" }), (0, jsx_runtime_1.jsx)(material_1.Box, { component: "ul", sx: { listStyleType: 'none', pl: 0 }, children: Object.entries(args).map(([key, value]) => ((0, jsx_runtime_1.jsx)(material_1.Box, { component: "li", sx: { mb: 1 }, children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body1", children: [(0, jsx_runtime_1.jsxs)("strong", { children: [key, ":"] }), " ", JSON.stringify(value)] }) }, key))) })] }));
};
function ToolNodesPage() {
    const [toolNodes, setToolNodes] = (0, react_1.useState)([]);
    const [newNodeSchema, setNewNodeSchema] = (0, react_1.useState)(defaultSchema);
    const [prompt, setPrompt] = (0, react_1.useState)('');
    const [decision, setDecision] = (0, react_1.useState)(null);
    const [isLoadingAddNode, setIsLoadingAddNode] = (0, react_1.useState)(false);
    const [isLoadingPrompt, setIsLoadingPrompt] = (0, react_1.useState)(false);
    const [addNodeError, setAddNodeError] = (0, react_1.useState)(null);
    const [feedbackGiven, setFeedbackGiven] = (0, react_1.useState)(false);
    // Fetch existing tool nodes on page load
    (0, react_1.useEffect)(() => {
        fetch('http://localhost:5500/api/getToolGraph')
            .then((res) => res.json())
            .then((data) => setToolNodes(JSON.parse(data))) // Directly set the array
            .catch((err) => console.error('Error fetching tool nodes:', err));
    }, []);
    const handleFeedback = (type) => {
        console.log(`Feedback given: ${type}`);
        // TODO: Handle the feedback logic here, e.g., send it to an API or update state
        setFeedbackGiven(true);
    };
    const JsonSchemaViewer = (schema) => {
        const parsedSchema = JSON.parse(schema);
        return ((0, jsx_runtime_1.jsx)("div", { style: { padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }, children: (0, jsx_runtime_1.jsx)(react_json_prettify_1.default, { json: parsedSchema }) }));
    };
    const handleAddNode = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setIsLoadingAddNode(true);
            setAddNodeError(null); // Clear any previous error message
            const schema = JSON.parse(newNodeSchema);
            const res = yield fetch('http://localhost:5500/api/writeToolNode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schema),
            });
            if (!res.ok) {
                const errorData = yield res.json();
                throw new Error(errorData.message);
            }
            const data = yield res.json();
            setToolNodes((prev) => [...prev, data]);
            setNewNodeSchema(defaultSchema);
        }
        catch (error) {
            setAddNodeError(error.message);
        }
        finally {
            setIsLoadingAddNode(false);
        }
    });
    const handleDeleteNode = (index) => {
        // Remove the node at the given index
        const updatedToolNodes = toolNodes.filter((_, i) => i !== index);
        setToolNodes(updatedToolNodes); // Filter out the node by index
        // Trigger the POST request to update the backend
        fetch('http://localhost:5500/api/writeToolGraph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedToolNodes), // Make sure to send the updated array
        })
            .then((res) => res.json())
            .then((data) => console.log('Tool Graph updated:', data))
            .catch((err) => console.error('Error updating tool graph:', err));
    };
    const handleSendPrompt = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setIsLoadingPrompt(true);
            const res = yield fetch('http://localhost:5500/api/getFunctionCallDecisionMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = yield res.json();
            console.log(JSON.stringify(data));
            setDecision(data);
        }
        catch (error) {
            console.error('Error sending prompt:', error);
        }
        finally {
            setIsLoadingPrompt(false);
            setFeedbackGiven(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "xl", style: { marginTop: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, children: "Tool Nodes Interface" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Tool Nodes" }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                            display: 'flex',
                            gap: '1rem',
                            overflowX: 'auto',
                            padding: '0.5rem',
                        }, children: toolNodes.length > 0 ? toolNodes.map((node, index) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                                border: '1px solid #000',
                                padding: '1rem',
                                borderRadius: '8px',
                                minWidth: '550px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                justifyContent: 'flex-start',
                                backgroundColor: '#f9f9f9',
                                position: 'relative',
                            }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "subtitle1", children: ["Name: ", node.function.name] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body1", children: ["Description: ", node.function.description] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "subtitle2", sx: {
                                        maxHeight: '300px',
                                        overflowY: 'auto', // Enable scrolling if content exceeds maxHeight
                                        paddingRight: '8px', // Optional, to prevent scroll bar from overlapping text
                                    }, children: ["Parameters: ", JsonSchemaViewer(JSON.stringify(node.function.parameters))] }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDeleteNode(index), sx: {
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        backgroundColor: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }, children: (0, jsx_runtime_1.jsx)(icons_material_1.Delete, {}) })] }, index))) : ((0, jsx_runtime_1.jsx)(material_1.Typography, { children: "No tool nodes available" })) })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, border: '1px solid #ccc', padding: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Add a New Tool Node" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "JSON Schema", multiline: true, rows: 8, value: newNodeSchema, onChange: (e) => setNewNodeSchema(e.target.value), fullWidth: true, variant: "outlined" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleAddNode, style: { marginTop: '1rem' }, disabled: isLoadingAddNode, children: isLoadingAddNode ? (0, jsx_runtime_1.jsx)(material_2.CircularProgress, { size: 24 }) : 'Add Node' }), addNodeError && ((0, jsx_runtime_1.jsx)(material_1.Typography, { color: "error", sx: { marginTop: '0.5rem' }, children: addNodeError }))] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, border: '1px solid #ccc', padding: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Send a Prompt" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Prompt", multiline: true, rows: 4, value: prompt, onChange: (e) => setPrompt(e.target.value), fullWidth: true, variant: "outlined" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSendPrompt, style: { marginTop: '1rem' }, disabled: isLoadingPrompt, children: isLoadingPrompt ? (0, jsx_runtime_1.jsx)(material_2.CircularProgress, { size: 24 }) : 'Send' }), decision && ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { marginTop: '1rem', flexShrink: 0 }, children: [(0, jsx_runtime_1.jsx)(DecisionDisplay, { decision: decision.data }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { marginTop: '1rem',
                                            maxWidth: '100%',
                                            width: '100%',
                                        }, children: feedbackGiven ? ((0, jsx_runtime_1.jsx)(material_1.Typography, { color: "primary", variant: "body1", children: "Thank you for your feedback!" })) : ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: '1rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "success", onClick: () => handleFeedback('up'), children: "\uD83D\uDC4D Correct" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "error", onClick: () => handleFeedback('down'), children: "\uD83D\uDC4E Wrong tool" })] })) })] }))] })] })] }));
}
//# sourceMappingURL=toolNodesTab.js.map