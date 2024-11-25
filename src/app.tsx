import './output.css'
import {useState, React} from 'react'
import {CombinedCard, Message, StringCard} from './types'
import PersonCard from "./personcard";

  function renderContent(message: Message) {
    if (!message.renderCard) {
        if (message.role === 'user') {
            return (<div className="flex flex-row-reverse"><p className={"message " + message.role + " inline-block mt-8 p-2 mr-4"}>{message.content}</p></div>)
        } else {
            return (<div className="flex"><p className={"message " + message.role + " inline-block mt-8 p-4"}>{message.content}</p></div>)
        }
    } else {
        return (<div className="flex justify-start"><p className="inline-block mt-8 p-4"><PersonCard {...message.card}/></p></div>)
    }
  }

function App() {
    const [ formValue, setFormValue] = useState('')
    const [messages, setMessages] = useState<Message[]> ([])
    const newMessage: React.FormEventHandler = async(s) => {
        s.preventDefault()
        setFormValue('')
            const appendMsgs: Message[] = formValue.trim() !== '' ? [...messages, {
                role: 'user',
                content: formValue
            }] : messages;
            setMessages(appendMsgs)
            const response = await fetch("http://localhost:5500/api/openai", {
                method:'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: appendMsgs })
            });
            const responseContent = await response.text()
            const responseCard : CombinedCard = JSON.parse(responseContent)
            if (responseCard.type === "person") {
                setMessages([...appendMsgs, {
                    role: 'system',
                    content: 'chat response with a UI card about the person.',
                    card: responseCard.data,
                    renderCard: true,
                }])
            } else if(responseCard.type === "string") {
                const stringCard = responseCard.data as StringCard;
                setMessages([...appendMsgs, {
                    role: 'system',
                    content: stringCard.chat_response,
                    renderCard: false
                }])
            }
    }

    return (<main className="flex flex-col h-screen">
        <h1 class="text-4xl font-bold text-center text-blue-600 my-4">Renderabl</h1>
        <div className="flex-grow overflow-y-auto px-4">
        {
            messages.map((message) =>
                renderContent(message)
            )
        }
        </div>
        <form className="flex justify-between px-4 mt-8 pb-4" onSubmit={newMessage}>
            <input type="text" className="mr-4 flex-grow leading-8 border rounded-md p-2" placeholder="Enter your message here!"
            value = {formValue}
            onChange={s => setFormValue(s.currentTarget.value)}
             />
            <input type="submit" className = "border rounded-md p-2 bg-gray-200" value="Send" />
        </form>
    </main>);
}

export default App