import './app.css'
import {useState, React} from 'react'
import {Message} from './types'

/**
 * The main app component.
 * 
 * Displays a basic chatbot interface.
 * 
 * @returns The JSX for the app component.
 */


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
        setMessages([...appendMsgs, {
            role: 'system',
            content: JSON.stringify(responseContent)
        }])
    }

    return (<main>
        <h1> [insert name here] chatbot </h1>
        <div>
            <p>Start your renderabl chat here!</p>
            {
                messages.map((message, index) =>
                  <p key={index} className={"message " + message.role}>{message.content}</p>
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