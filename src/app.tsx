import './output.css'
import {useState, React} from 'react'
import {Message} from './types'
import PersonCard from "./personcard";

  function renderContent(message: Message) {
    if (!message.renderCard) {
        return (<p className={"message " + message.role}>{message.content}</p>)
    } else {
        return (<p className={"message " + message.role}><PersonCard {...message.card}/></p>)
    }
  }

function App() {
    const [ formValue, setFormValue] = useState('')
    const [messages, setMessages] = useState<Message[]> ([

    ])
    const newMessage: React.FormEventHandler = async(s) => {
        s.preventDefault()
        setFormValue('')
        const appendMsgs: Message[] = [...messages, {
            role: 'user',
            content: formValue
        }];
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
        try {
            const responseCard = JSON.parse(responseContent)
            setMessages([...appendMsgs, {
                role: 'system',
                content: 'generated UI card rendered by response',
                card: responseCard,
                renderCard: true,
            }])
        } catch {
            setMessages([...appendMsgs, {
                role: 'system',
                content: responseContent,
                renderCard: false
            }])
        }
    }

    return (<main>
        <h1> [insert name here] chatbot </h1>
        <div>
            <p>Start your renderabl chat here!</p>
            {
                messages.map((message) =>
                  renderContent(message)
                )
            }
        </div>
        <form className="input-form" onSubmit={newMessage}>
            <input type="text" placeholder="Enter your message here!"
            value = {formValue}
            onChange={s => setFormValue(s.currentTarget.value)}
             />
            <input type="submit" value="Send" />
        </form>
    </main>);
}

export default App