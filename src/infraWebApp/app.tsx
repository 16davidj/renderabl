import { useState } from 'react';
import { Box, Typography, Drawer, List, ListItemButton, ListItemText, AppBar, Toolbar, IconButton } from '@mui/material';

import ContextTab from './components/contextTab';

const drawerWidth = 240;

export default function App() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false);  // For mobile or responsive drawer toggle

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar (Drawer) */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    <ListItemButton onClick={() => setSelectedTab(0)}>
                        <ListItemText primary="Context Data" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setSelectedTab(1)}>
                        <ListItemText primary="Another Tab" />
                    </ListItemButton>
                    {/* Add more tabs as needed */}
                </List>
            </Drawer>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <AppBar position="sticky">
                    <Toolbar> 
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Renderabl Infra App
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Display content based on selected tab */}
                {selectedTab === 0 && <ContextTab />}
                {selectedTab === 1 && (
                    <Typography variant="h6">Content for Another Tab</Typography>
                )}
            </Box>
        </Box>
    );
}
