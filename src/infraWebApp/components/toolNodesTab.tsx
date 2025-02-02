import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import OpenAI from 'openai';
import { CircularProgress } from '@mui/material';
import ReactJsonPrettify from 'react-json-prettify';

const defaultSchema = `{
    "agentName": "SampleAgent",
    "agentArgs": {"type":"object","properties":{"field1":{"type":"string"}, "field2":{"type":"string"}}, "required":["field1"], "additionalProperties": false},
    "agentDescription": "Insert description here"
}`;

interface DecisionProps {
    decision: {
      functionName: string;
      args: Record<string, any>;
    };
}

const DecisionDisplay: React.FC<DecisionProps> = ({ decision }) => {
    const { functionName, args } = decision;  
    return (
      <Box>
        <Typography variant="h6">Function Name</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {functionName}
        </Typography>
        <Typography variant="h6">Arguments</Typography>
        <Box component="ul" sx={{ listStyleType: 'none', pl: 0 }}>
          {Object.entries(args).map(([key, value]) => (
            <Box component="li" key={key} sx={{ mb: 1 }}>
              <Typography variant="body1">
                <strong>{key}:</strong> {JSON.stringify(value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };


export default function ToolNodesPage() {
    const [toolNodes, setToolNodes] = useState<OpenAI.ChatCompletionTool[]>([]);
    const [newNodeSchema, setNewNodeSchema] = useState(defaultSchema);
    const [prompt, setPrompt] = useState('');
    const [decision, setDecision] = useState(null);
    const [isLoadingAddNode, setIsLoadingAddNode] = useState(false);
    const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
    const [addNodeError, setAddNodeError] = useState<string | null>(null);
    const [feedbackGiven, setFeedbackGiven] = useState(false);

    // Fetch existing tool nodes on page load
    useEffect(() => {
        fetch('http://localhost:5500/api/getToolGraph')
            .then((res) => res.json())
            .then((data) => setToolNodes(JSON.parse(data))) // Directly set the array
            .catch((err) => console.error('Error fetching tool nodes:', err));
    }, []);

    const handleFeedback = (type: 'up' | 'down') => {
        console.log(`Feedback given: ${type}`);
        // TODO: Handle the feedback logic here, e.g., send it to an API or update state
        setFeedbackGiven(true);
    };

    const JsonSchemaViewer = (schema: string) => {
        const parsedSchema = JSON.parse(schema);
    
        return (
            <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <ReactJsonPrettify json={parsedSchema}/>
            </div>
        );
    };

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
            setFeedbackGiven(false);
        }
    };

    return (
        <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
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
                            minWidth: '550px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            justifyContent: 'flex-start',
                            backgroundColor: '#f9f9f9',
                            position: 'relative',
                        }}
                    >
                        <Typography variant="subtitle1">Name: {node.function.name}</Typography>
                        <Typography variant="body1">Description: {node.function.description}</Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                maxHeight: '300px',
                                overflowY: 'auto', // Enable scrolling if content exceeds maxHeight
                                paddingRight: '8px', // Optional, to prevent scroll bar from overlapping text
                            }}
                        >Parameters: {JsonSchemaViewer(JSON.stringify(node.function.parameters))}</Typography>

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
                        <Box sx={{ marginTop: '1rem', flexShrink: 0}}>
                            <DecisionDisplay decision={decision.data} />
                            {/* Feedback Buttons */}
                            <Box sx={{ marginTop: '1rem',
                                maxWidth: '100%',
                                width: '100%',
                             }}>
                            {feedbackGiven ? (
                                <Typography color="primary" variant="body1">
                                    Thank you for your feedback!
                                </Typography>
                            ) : (
                                <Box sx={{ display: 'flex', gap: '1rem' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleFeedback('up')}
                                    >
                                        👍 Correct
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleFeedback('down')}
                                    >
                                        👎 Wrong tool
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
