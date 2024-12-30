import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

const defaultSchema = `{
    "agentName": "SampleAgent",
    "agentArgs": {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"field1":{"type":"string"}, "field2":{"type":"string"}}, "required":["field1"], "additionalProperties": false},
    "agentDescription": "Insert description here"
}`

export default function ToolNodesPage() {
    const [toolNodes, setToolNodes] = useState([]); // Array of tool nodes
    const [newNodeSchema, setNewNodeSchema] = useState(defaultSchema); // JSON Schema input
    const [prompt, setPrompt] = useState(''); // User's prompt input
    const [decision, setDecision] = useState(null); // Decision JSON

    // Fetch existing tool nodes on page load
    useEffect(() => {
        fetch('http://localhost:5500/api/getToolGraph')
            .then((res) => res.json())
            .then((data) => setToolNodes(JSON.parse(data)))
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
                    setToolNodes((prev) => [...prev, data]); // Add new node to the shelf
                    setNewNodeSchema(defaultSchema); // Reset input field
                })
                .catch((err) => console.error('Error adding tool node:', err));
        } catch (error) {
            console.error('Invalid JSON Schema:', error);
        }
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

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Tool Nodes Interface
            </Typography>
            
            {/* Top Half: Tool Nodes Shelf */}
            <Box sx={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem' }}>
                <Typography variant="h6" gutterBottom>
                    Tool Nodes
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        overflowX: 'auto',
                        padding: '0.5rem',
                    }}
                >
                    {toolNodes.map((node, index) => (
                        <Box
                            key={index}
                            sx={{
                                border: '1px solid #000',
                                padding: '1rem',
                                borderRadius: '8px',
                                minWidth: '250px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <Typography variant="subtitle1">Name: {node.function.name}</Typography>
                            <Typography variant="body1">Description: {node.function.description}</Typography>
                            <Typography variant="subtitle2">Parameters: {JSON.stringify(node.function.parameters)}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Bottom Half: JSON Input and Prompt Section */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                {/* JSON Schema Input */}
                <Box sx={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
                    <Typography variant="h6">Add a New Tool Node</Typography>
                    <TextField
                        label="JSON Schema"
                        multiline
                        rows={8}
                        value={newNodeSchema}
                        onChange={(e) => setNewNodeSchema(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNode}
                        style={{ marginTop: '1rem' }}
                    >
                        Add Node
                    </Button>
                </Box>

                {/* Prompt Input */}
                <Box sx={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
                    <Typography variant="h6">Send a Prompt</Typography>
                    <TextField
                        label="Prompt"
                        multiline
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendPrompt}
                        style={{ marginTop: '1rem' }}
                    >
                        Send
                    </Button>

                    {/* Decision Output */}
                    {decision && (
                        <Box sx={{ marginTop: '1rem' }}>
                            <Typography variant="h6">Decision:</Typography>
                            <pre>{JSON.stringify(decision, null, 2)}</pre>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
