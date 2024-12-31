import React, { useState } from "react";
import { Box, TextField, Button, Grid, Paper, Typography } from "@mui/material";
import * as Babel from "@babel/standalone";

const defaultSchema = `{
    "agentName": "SampleAgent",
    "agentProps": "picture_url: string, name: string, summary:string",
    "agentDescription": "A UI card components designed to show information about a sample topic."
}`

window.React = React;

const ComponentGenerator: React.FC = () => {
    const [jsonSchema, setJsonSchema] = useState(defaultSchema);
    const [generatedCode, setGeneratedCode] = useState("");
    const [renderOutput, setRenderOutput] = useState<React.ReactNode>(null);

    const handleGenerate = async () => {
        try {
            const response = await fetch("http://localhost:5500/api/generateComponent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonSchema,
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedCode(data);
                console.log("Generated code:", data);
                // Transpile JSX to plain JavaScript
                // We need to use export default here instead of return because we
                // would get componentGenTab.tsx:50 Error generating component: SyntaxError:
                // unknown: 'return' outside of function. 
                const transpiledCode = Babel.transform(data, {
                    presets: ["react"],
                }).code;
                // If we don't replace "export default" with return, we get: Error rendering component: SyntaxError: Unexpected token 'export
                const Component = new Function(
                    'React',
                    `${transpiledCode.replace("export default", "return")}`
                )(React);
                setRenderOutput(<Component />);
            }
        } catch (error) {
            console.error("Error generating component:", error);
        }
    };

    return (
        <Box padding={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: "16px" }}>
                        <Typography variant="h6" gutterBottom>
                            JSON Schema Input
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={20}
                            value={jsonSchema}
                            onChange={(e) => setJsonSchema(e.target.value)}
                            variant="outlined"
                        />
                        <Box marginTop={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleGenerate}
                            >
                                Generate Component
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper elevation={3} style={{ padding: "16px" }}>
                                <Typography variant="h6" gutterBottom>
                                    Generated Code
                                </Typography>
                                <Box
                                    component="pre"
                                    style={{
                                        backgroundColor: "#f4f4f4",
                                        padding: "16px",
                                        borderRadius: "4px",
                                        overflowX: "auto",
                                        maxHeight: "400px",
                                    }}
                                >
                                    {generatedCode || "Your generated code will appear here."}
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={3} style={{ padding: "16px" }}>
                                <Typography variant="h6" gutterBottom>
                                    Rendered Output
                                </Typography>
                                <Box
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "16px",
                                        borderRadius: "4px",
                                        minHeight: "100px",
                                    }}
                                >
                                    {renderOutput || "Your rendered component will appear here."}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ComponentGenerator;