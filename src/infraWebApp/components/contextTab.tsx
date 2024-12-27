import { useState, useEffect } from 'react';
import { Button, TextField, Container, Box, Typography, IconButton, CircularProgress, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

async function getContextData(): Promise<string> {
    const response = await fetch(`http://localhost:5500/api/getContext`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);
        return '';
    }

    const data = await response.json();
    return data;
}

export default function ContextTab() {
    const [dataMap, setDataMap] = useState(new Map());
    const [tempData, setTempData] = useState<Map<string, string[]>>(new Map());
    const [loading, setLoading] = useState(false); // State for loading
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getContextData();
                const responseData: Map<string, string[]> = new Map(Object.entries(JSON.parse(data)));
                setDataMap(responseData);
                setTempData(new Map(responseData)); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const changeKey = (oldKey: string, newKey: string) => {
        if (oldKey === newKey) return;
        setTempData((prevMap) => {
            const newMap = new Map(prevMap);
            const values = newMap.get(oldKey);
            newMap.delete(oldKey);
            newMap.set(newKey, values);
            return newMap;
        });
    };

    const changeValue = (key: string, newValue: string) => {
        setTempData((prevMap) => {
            const updatedMap = new Map(prevMap);
            updatedMap.set(key, newValue.split(',').map((val) => val.trim())); 
            return updatedMap;
        });
    };

    const addKvPair = () => {
        setTempData((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set('', []); 
            return newMap;
        });
    };

    const deleteKvPair = (key: string) => {
        setTempData((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.delete(key); // Remove the key-value pair by its key
            return newMap;
        });
    };


    const handleSubmit = () => {
        setLoading(true); // Set loading state to true when submitting
        setSuccessMessage(''); // Clear any previous success message
        setErrorMessage(''); // Clear any previous error message

        setDataMap(tempData);

        const plainObject = Object.fromEntries(tempData);

        fetch('http://localhost:5500/api/provideContext', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plainObject),
        })
            .then((response) => {
                if (response.ok) {
                    setSuccessMessage('Update Successful!'); // Show success message
                    setErrorMessage(''); // Clear error message
                } else {
                    throw new Error('Failed to update');
                }
            })
            .catch((err) => {
                console.error('Error updating:', err);
                setErrorMessage('Error updating context'); // Show error message
            })
            .finally(() => {
                setLoading(false); // Set loading state to false after the request is done
            });
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Context Data
            </Typography>
            {[...tempData.entries()].map(([key, value], keyIndex) => (
                <Box
                    key={keyIndex}
                    sx={{
                        marginBottom: '1rem',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '1rem',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Key"
                        variant="outlined"
                        value={key}
                        onChange={(e) => changeKey(key, e.target.value)} 
                        sx={{ flex: '0 0 30%' }}
                    />
                    <TextField
                        label="Values"
                        variant="outlined"
                        value={value.join(', ')} 
                        onChange={(e) => changeValue(key, e.target.value)} 
                        fullWidth
                    />
                    <IconButton color="secondary" onClick={() => deleteKvPair(key)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    marginTop: '1rem',
                }}
            >
                <IconButton color="primary" onClick={addKvPair}>
                    <AddIcon />
                </IconButton>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Update Context'}
                </Button>
            </Box>

            {/* Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={5000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
            />
            {/* Error Snackbar */}
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={5000}
                onClose={() => setErrorMessage('')}
                message={errorMessage}
            />
        </Container>
    );
}
