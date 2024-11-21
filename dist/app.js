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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./app.css");
const react_1 = require("react");
/**
 * The main app component.
 *
 * Displays a basic chatbot interface.
 *
 * @returns The JSX for the app component.
 */
function App() {
    const [formValue, setFormValue] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const newMessage = (s) => __awaiter(this, void 0, void 0, function* () {
        s.preventDefault();
        setFormValue('');
        const appendMsgs = [...messages, {
                role: 'user',
                content: formValue
            }];
        setMessages(appendMsgs);
        const response = yield fetch("http://localhost:5500/api/openai", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: appendMsgs })
        });
        const responseContent = yield response.text();
        setMessages([...appendMsgs, {
                role: 'system',
                content: JSON.stringify(responseContent)
            }]);
    });
    return ((0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsx)("h1", { children: " [insert name here] chatbot " }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: "Start your renderabl chat here!" }), messages.map((message, index) => (0, jsx_runtime_1.jsx)("p", Object.assign({ className: "message " + message.role }, { children: message.content }), index))] }), (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "input-form", onSubmit: newMessage }, { children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Enter your message here!", value: formValue, onChange: s => setFormValue(s.currentTarget.value) }), (0, jsx_runtime_1.jsx)("input", { type: "submit", value: "Send" })] }))] }));
}
exports.default = App;
//# sourceMappingURL=app.js.map