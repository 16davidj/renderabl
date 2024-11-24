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
const jsx_runtime_1 = require("react/jsx-runtime");
require("./output.css");
const react_1 = require("react");
const personcard_1 = __importDefault(require("./personcard"));
function renderContent(message) {
    if (!message.renderCard) {
        if (message.role === 'user') {
            return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "flex flex-row-reverse" }, { children: (0, jsx_runtime_1.jsx)("p", Object.assign({ className: "message " + message.role + " inline-block mt-8 p-2 mr-4" }, { children: message.content })) })));
        }
        else {
            return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "flex" }, { children: (0, jsx_runtime_1.jsx)("p", Object.assign({ className: "message " + message.role + " inline-block mt-8 p-4" }, { children: message.content })) })));
        }
    }
    else {
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "flex justify-start" }, { children: (0, jsx_runtime_1.jsx)("p", Object.assign({ className: "inline-block mt-8 p-4" }, { children: (0, jsx_runtime_1.jsx)(personcard_1.default, Object.assign({}, message.card)) })) })));
    }
}
function App() {
    const [formValue, setFormValue] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const newMessage = (s) => __awaiter(this, void 0, void 0, function* () {
        s.preventDefault();
        setFormValue('');
        const appendMsgs = formValue.trim() !== '' ? [...messages, {
                role: 'user',
                content: formValue
            }] : messages;
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
        try {
            const responseCard = JSON.parse(responseContent);
            setMessages([...appendMsgs, {
                    role: 'system',
                    content: 'generated UI card rendered by response',
                    card: responseCard,
                    renderCard: true,
                }]);
        }
        catch (_a) {
            setMessages([...appendMsgs, {
                    role: 'system',
                    content: responseContent,
                    renderCard: false
                }]);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsx)("h1", Object.assign({ class: "text-4xl font-bold text-center text-blue-600 my-4" }, { children: "Renderabl" })), messages.map((message) => renderContent(message)), (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "flex justify-between px-4", onSubmit: newMessage }, { children: [(0, jsx_runtime_1.jsx)("input", { type: "text", className: "mr-4 flex-grow leading-8 mt-8 border rounded-md p-2", placeholder: "Enter your message here!", value: formValue, onChange: s => setFormValue(s.currentTarget.value) }), (0, jsx_runtime_1.jsx)("input", { type: "submit", className: "border rounded-md mt-8 p-2 bg-gray-200", value: "Send" })] }))] }));
}
exports.default = App;
//# sourceMappingURL=app.js.map