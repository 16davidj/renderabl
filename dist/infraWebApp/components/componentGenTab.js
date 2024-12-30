"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const Babel = __importStar(require("@babel/standalone"));
const defaultSchema = `{
    "agentName": "SampleAgent",
    "agentProps": "picture_url: string, name: string, summary:string",
    "agentDescription": "A UI card components designed to show information about a sample topic."
}`;
window.React = react_1.default;
const ComponentGenerator = () => {
    const [jsonSchema, setJsonSchema] = (0, react_1.useState)(defaultSchema);
    const [generatedCode, setGeneratedCode] = (0, react_1.useState)("");
    const [renderOutput, setRenderOutput] = (0, react_1.useState)(null);
    const handleGenerate = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:5500/api/generateComponent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonSchema,
            });
            if (response.ok) {
                const data = yield response.json();
                setGeneratedCode(data);
                // Transpile JSX to plain JavaScript
                const transpiledCode = Babel.transform(data, {
                    presets: ["react"],
                }).code;
                console.log("Transpiled Code:", transpiledCode);
                try {
                    const Component = new Function('React', `${transpiledCode.replace("export default", "return")}`)(react_1.default);
                    setRenderOutput((0, jsx_runtime_1.jsx)(Component, {}));
                }
                catch (error) {
                    console.error("Error rendering component:", error);
                }
            }
            else {
                console.error("Failed to generate component.");
            }
        }
        catch (error) {
            console.error("Error generating component:", error);
        }
    });
    return ((0, jsx_runtime_1.jsx)(material_1.Box, { padding: 2, children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 2, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, style: { padding: "16px" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "JSON Schema Input" }), (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, multiline: true, rows: 20, value: jsonSchema, onChange: (e) => setJsonSchema(e.target.value), variant: "outlined" }), (0, jsx_runtime_1.jsx)(material_1.Box, { marginTop: 2, children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleGenerate, children: "Generate Component" }) })] }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 2, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, style: { padding: "16px" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Generated Code" }), (0, jsx_runtime_1.jsx)(material_1.Box, { component: "pre", style: {
                                                backgroundColor: "#f4f4f4",
                                                padding: "16px",
                                                borderRadius: "4px",
                                                overflowX: "auto",
                                                maxHeight: "400px",
                                            }, children: generatedCode || "Your generated code will appear here." })] }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, style: { padding: "16px" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Rendered Output" }), (0, jsx_runtime_1.jsx)(material_1.Box, { style: {
                                                border: "1px solid #ddd",
                                                padding: "16px",
                                                borderRadius: "4px",
                                                minHeight: "100px",
                                            }, children: renderOutput || "Your rendered component will appear here." })] }) })] }) })] }) }));
};
exports.default = ComponentGenerator;
//# sourceMappingURL=componentGenTab.js.map