import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material'; // Import Material-UI's Delete icon
import OpenAI from 'openai';
import { CircularProgress } from '@mui/material'; // Import the loading spinner

const defaultSchema = `{
    "agentName": "SampleAgent",
    "agentArgs": {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"field1":{"type":"string"}, "field2":{"type":"string"}}, "required":["field1"], "additionalProperties": false},
    "agentDescription": "Insert description here"
}`;

export default function ToolNodesPage() {
    const [toolNodes, setToolNodes] = useState<OpenAI.ChatCompletionTool[]>([]);
    const [newNodeSchema, setNewNodeSchema] = useState(defaultSchema);
    const [prompt, setPrompt] = useState('');
    const [decision, setDecision] = useState(null);
    const [isLoadingAddNode, setIsLoadingAddNode] = useState(false);
    const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
    const [addNodeError, setAddNodeError] = useState<string | null>(null);

    // Fetch existing tool nodes on page load
    useEffect(() => {
        fetch('http://localhost:5500/api/getToolGraph')
            .then((res) => res.json())
            .then((data) => setToolNodes(JSON.parse(data))) // Directly set the array
            .catch((err) => console.error('Error fetching tool nodes:', err));
    }, []);

    const handleAddNode = async () => {
        try {
            setIsLoadingAddNode(true);
            setAddNodeError(null); // Clear any previous error message
            const schema = JSON.parse(newNodeSchema);
            const res = await fetch('http://localhost:5500/api/writeToolNode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schema),
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message);
            }
    
            const data = await res.json();
            setToolNodes((prev) => [...prev, data]);
            setNewNodeSchema(defaultSchema);
        } catch (error: any) {
            setAddNodeError(error.message);
        } finally {
            setIsLoadingAddNode(false);
        }
    };

    const handleDeleteNode = (index: number) => {
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
    

    const handleSendPrompt = async () => {
        try {
            setIsLoadingPrompt(true);
            const res = await fetch('http://localhost:5500/api/getFunctionCallDecisionMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setDecision(data);
        } catch (error) {
            console.error('Error sending prompt:', error);
        } finally {
            setIsLoadingPrompt(false);
        }
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
                    }}>
                    {toolNodes.length > 0 ? toolNodes.map((node, index) => (
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
                            position: 'relative', // For positioning the trash icon
                        }}
                    >
                        <Typography variant="subtitle1">Name: {node.function.name}</Typography>
                        <Typography variant="body1">Description: {node.function.description}</Typography>
                        <Typography variant="subtitle2">Parameters: {JSON.stringify(node.function.parameters)}</Typography>

                        {/* Trash Can Icon */}
                        <IconButton
                            onClick={() => handleDeleteNode(index)}
                            sx={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                backgroundColor: '#fff',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </Box>
                )) : (<Typography>No tool nodes available</Typography>)}
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
                        disabled={isLoadingAddNode}
                    >
                    {isLoadingAddNode ? <CircularProgress size={24} /> : 'Add Node'}
                    </Button>
                    {addNodeError && (
                        <Typography color="error" sx={{ marginTop: '0.5rem' }}>
                            {addNodeError}
                        </Typography>
                    )}
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
                        disabled={isLoadingPrompt} // Disable button during loading
                    >
                    {isLoadingPrompt ? <CircularProgress size={24} /> : 'Send'}
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
