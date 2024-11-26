import './output.css'
import React, {useState} from 'react'
import {CombinedCard, Message, PersonCardProps, StringCard} from './types'
import PersonCard from "./personcard";
import { MonitoringGraphProps } from './types';
import MonitoringGraph from './monitorgraph';

function renderContent(message: Message) {
    console.log("hi there")
    console.log(message)
    if (message.renderCard === "string") {
        if (message.role === 'user') {
            return (<div className="flex flex-row-reverse"><p className={"message " + message.role + " inline-block mt-8 p-2 mr-4"}>{message.content}</p></div>)
        } else {
            return (<div className="flex"><p className={"message " + message.role + " inline-block mt-8 p-4"}>{message.content}</p></div>)
        }
    } else if (message.renderCard === "person"){
        return (<div className="flex justify-start"><p className="inline-block mt-8 p-4"><PersonCard {...message.card}/></p></div>)
    } else if (message.renderCard === "graph") {
        return (<div><MonitoringGraph {...message.tempGraph}/></div>)
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
                content: formValue,
                renderCard: "string"
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
            //const graphCard : MonitoringGraphProps = JSON.parse(responseContent)
            //console.log(graphCard)
            if (responseCard.type === "person") {
                const personCard = responseCard.data as PersonCardProps;
                setMessages([...appendMsgs, {
                    role: 'system',
                    content: 'chat response with a UI card about the person.',
                    card: personCard,
                    renderCard: responseCard.type,
                }])
            } else if(responseCard.type === "string") {
                const stringCard = responseCard.data as StringCard;
                setMessages([...appendMsgs, {
                    role: 'system',
                    content: stringCard.chat_response,
                    renderCard: responseCard.type
                }])
            } 
            // else if (responseCard.type === "graph") {
            //     setMessages([...appendMsgs, {
            //         role: 'system',
            //         content: 'chat response with a graph of the traffic the user requested.',
            //         tempGraph: graphCard,
            //         renderCard: 'graph'
            //     }])
            // }
    }

    return (<main className="flex flex-col h-screen">
        <h1 className="text-4xl font-bold text-center text-blue-600 my-4">Renderabl</h1>
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