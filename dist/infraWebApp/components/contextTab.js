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
exports.default = ContextTab;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const Add_1 = __importDefault(require("@mui/icons-material/Add"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
function getContextData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5500/api/getContext`, {
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
        const data = yield response.json();
        return data;
    });
}
function ContextTab() {
    const [dataMap, setDataMap] = (0, react_1.useState)(new Map());
    const [tempData, setTempData] = (0, react_1.useState)(new Map());
    const [loading, setLoading] = (0, react_1.useState)(false); // State for loading spinner
    const [successMessage, setSuccessMessage] = (0, react_1.useState)('');
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    // Fetch existing context data on page load.
    (0, react_1.useEffect)(() => {
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield getContextData();
                const responseData = new Map(Object.entries(JSON.parse(data)));
                setDataMap(responseData);
                setTempData(new Map(responseData));
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        });
        fetchData();
    }, []);
    const changeKey = (oldKey, newKey) => {
        if (oldKey === newKey)
            return;
        setTempData((prevMap) => {
            const newMap = new Map(prevMap);
            const values = newMap.get(oldKey);
            newMap.delete(oldKey);
            newMap.set(newKey, values);
            return newMap;
        });
    };
    const changeValue = (key, newValue) => {
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
    const deleteKvPair = (key) => {
        setTempData((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.delete(key);
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
                setSuccessMessage('Update Successful!');
                setErrorMessage(''); // Clear error message
            }
            else {
                throw new Error('Failed to update');
            }
        })
            .catch((err) => {
            console.error('Error updating:', err);
            setErrorMessage('Error updating context');
        })
            .finally(() => {
            setLoading(false); // Set loading state to false after the request is done
        });
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "md", style: { marginTop: '2rem' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, children: "Context Data" }), [...tempData.entries()].map(([key, value], keyIndex) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    marginBottom: '1rem',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Key", variant: "outlined", value: key, onChange: (e) => changeKey(key, e.target.value), sx: { flex: '0 0 30%' } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Values", variant: "outlined", value: value.join(', '), onChange: (e) => changeValue(key, e.target.value), fullWidth: true }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { color: "secondary", onClick: () => deleteKvPair(key), children: (0, jsx_runtime_1.jsx)(Delete_1.default, {}) })] }, keyIndex))), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    marginTop: '1rem',
                }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { color: "primary", onClick: addKvPair, children: (0, jsx_runtime_1.jsx)(Add_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSubmit, disabled: loading, children: loading ? (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 24 }) : 'Update Context' })] }), (0, jsx_runtime_1.jsx)(material_1.Snackbar, { open: !!successMessage, autoHideDuration: 5000, onClose: () => setSuccessMessage(''), message: successMessage }), (0, jsx_runtime_1.jsx)(material_1.Snackbar, { open: !!errorMessage, autoHideDuration: 5000, onClose: () => setErrorMessage(''), message: errorMessage })] }));
}
//# sourceMappingURL=contextTab.js.map