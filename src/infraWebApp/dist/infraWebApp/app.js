"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const contextTab_1 = __importDefault(require("./components/contextTab"));
const toolNodesTab_1 = __importDefault(require("./components/toolNodesTab"));
const componentGenTab_1 = __importDefault(require("./components/componentGenTab"));
const drawerWidth = 240;
function App() {
    const [selectedTab, setSelectedTab] = (0, react_1.useState)(0);
    const [openDrawer, setOpenDrawer] = (0, react_1.useState)(false); // For responsive drawer toggle
    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex' }, children: [(0, jsx_runtime_1.jsx)(material_1.Drawer, { sx: {
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }, variant: "permanent", anchor: "left", children: (0, jsx_runtime_1.jsxs)(material_1.List, { children: [(0, jsx_runtime_1.jsx)(material_1.ListItemButton, { onClick: () => setSelectedTab(0), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: "Context Data" }) }), (0, jsx_runtime_1.jsx)(material_1.ListItemButton, { onClick: () => setSelectedTab(1), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: "Tool Decider" }) }), (0, jsx_runtime_1.jsx)(material_1.ListItemButton, { onClick: () => setSelectedTab(2), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: "Component Generator" }) })] }) }), (0, jsx_runtime_1.jsxs)(material_1.Box, { component: "main", sx: { flexGrow: 1, bgcolor: 'background.default', p: 3 }, children: [(0, jsx_runtime_1.jsx)(material_1.AppBar, { position: "sticky", children: (0, jsx_runtime_1.jsx)(material_1.Toolbar, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", sx: { flexGrow: 1 }, children: "Renderabl Infra App" }) }) }), selectedTab === 0 && (0, jsx_runtime_1.jsx)(contextTab_1.default, {}), selectedTab === 1 && ((0, jsx_runtime_1.jsx)(toolNodesTab_1.default, {})), selectedTab === 2 && ((0, jsx_runtime_1.jsx)(componentGenTab_1.default, {}))] })] }));
}
//# sourceMappingURL=app.js.map