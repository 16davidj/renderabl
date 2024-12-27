'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContextTab;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const Add_1 = __importDefault(require("@mui/icons-material/Add"));
function getContextData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5500/api/getContext`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json', // Add this to specify the expected response format
            },
        });
        // Ensure the response status is OK
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);
            return;
        }
        // Parse the JSON from the response body
        const data = yield response.json();
        console.log("Parsed data:", data);
        return data;
    });
}
function ContextTab() {
    const [dataMap, setDataMap] = (0, react_1.useState)(new Map());
    (0, react_1.useEffect)(() => {
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield getContextData();
                const responseData = JSON.parse(data);
                console.log(responseData);
                setDataMap(responseData);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        });
        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount
    const handleKeyChange = (oldKey, newKey) => {
        if (oldKey === newKey)
            return;
        setDataMap((prevMap) => {
            const newMap = new Map(prevMap);
            const value = newMap.get(oldKey);
            newMap.delete(oldKey);
            newMap.set(newKey, value);
            return newMap;
        });
    };
    const handleValueChange = (key, newValue) => {
        setDataMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(key, newValue);
            return newMap;
        });
    };
    const handleAddKeyValuePair = () => {
        setDataMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set('', '');
            return newMap;
        });
    };
    const handleSubmit = () => {
        getContextData();
        const plainObject = Object.fromEntries(dataMap);
        fetch('/api/provideContext', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plainObject),
        })
            .then((res) => res.json())
            .then((data) => console.log('Updated successfully:', data))
            .catch((err) => console.error('Error updating:', err));
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "md", style: { marginTop: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, children: "Context Data" }), [...dataMap.entries()].map(([key, value], keyIndex) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    marginBottom: '1rem',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Key", variant: "outlined", value: key, onChange: (e) => handleKeyChange(key, e.target.value), sx: { flex: '0 0 30%' } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Value", variant: "outlined", value: value, onChange: (e) => handleValueChange(key, e.target.value), fullWidth: true })] }, keyIndex))), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    marginTop: '1rem',
                }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { color: "primary", onClick: handleAddKeyValuePair, children: (0, jsx_runtime_1.jsx)(Add_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSubmit, children: "Update Context" })] })] }));
}
//# sourceMappingURL=contextTab.js.map