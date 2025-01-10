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
const jsx_runtime_1 = require("react/jsx-runtime");
require("./output.css");
const react_1 = require("react");
const personcard_1 = __importDefault(require("./generalcards/personcard"));
const golfplayercard_1 = __importDefault(require("./golfcards/golfplayercard"));
const golftournamentcard_1 = __importDefault(require("./golfcards/golftournamentcard"));
const jobCard_1 = __importDefault(require("./generalcards/jobCard"));
function App() {
    const [formValue, setFormValue] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    function renderContent(message) {
        if (message.cardType === "string") {
            if (message.role === 'user') {
                return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-row-reverse", children: (0, jsx_runtime_1.jsx)("p", { className: "message " + message.role + " inline-block mt-8 p-2 mr-4", children: message.content }) }));
            }
            else {
                return ((0, jsx_runtime_1.jsx)("div", { className: "flex", children: (0, jsx_runtime_1.jsx)("p", { className: "message " + message.role + " inline-block mt-8 p-4", children: message.content }) }));
            }
        }
        else if (message.cardType === "person") {
            return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-start", children: (0, jsx_runtime_1.jsx)("p", { className: "inline-block mt-8 p-4", children: (0, jsx_runtime_1.jsx)(personcard_1.default, Object.assign({}, message.personCard)) }) }));
        }
        else if (message.cardType === "player") {
            return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-start", children: (0, jsx_runtime_1.jsx)("p", { className: "inline-block mt-8 p-4", children: (0, jsx_runtime_1.jsx)(golfplayercard_1.default, Object.assign({}, message.golfPlayerCard, { messages: messages, setMessages: setMessages })) }) }));
        }
        else if (message.cardType === "tournament") {
            return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-start", children: (0, jsx_runtime_1.jsx)("p", { className: "inline-block mt-8 p-4", children: (0, jsx_runtime_1.jsx)(golftournamentcard_1.default, Object.assign({}, message.golfTournamentCard, { messages: messages, setMessages: setMessages })) }) }));
        }
        else if (message.cardType === "job" && message.jobContent.length > 0) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-start", children: (0, jsx_runtime_1.jsx)("p", { className: "inline-block mt-8 p-4", children: (0, jsx_runtime_1.jsx)(jobCard_1.default, { jobs: message.jobContent }) }) }));
        }
    }
    const newMessage = (s) => __awaiter(this, void 0, void 0, function* () {
        s.preventDefault();
        setFormValue('');
        const appendMsgs = formValue.trim() !== '' ? [...messages, {
                role: 'user',
                content: formValue,
                cardType: "string"
            }] : messages;
        setMessages(appendMsgs);
        const response = yield fetch(`http://localhost:5501/api/renderabl`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: appendMsgs })
        });
        const responseMsg = JSON.parse(yield response.text());
        setMessages([...appendMsgs, responseMsg]);
    });
    return ((0, jsx_runtime_1.jsxs)("main", { className: "flex flex-col h-screen", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-center text-blue-600 my-4", children: "Renderabl" }), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow overflow-y-auto px-4", children: messages.map((message) => renderContent(message)) }), (0, jsx_runtime_1.jsxs)("form", { className: "flex justify-between px-4 mt-8 pb-4", onSubmit: newMessage, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", className: "mr-4 flex-grow leading-8 border rounded-md p-2", placeholder: "Enter your message here!", value: formValue, onChange: s => setFormValue(s.currentTarget.value) }), (0, jsx_runtime_1.jsx)("input", { type: "submit", className: "border rounded-md p-2 bg-gray-200", value: "Send" })] })] }));
}
exports.default = App;
//# sourceMappingURL=app.js.map