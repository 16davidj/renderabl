import './output.css'
import React, {useState} from 'react'
import {Message} from './types'
import PersonCard from "./generalcards/personcard";
import GolfPlayerCard from './golfcards/golfplayercard';
import GolfTournamentCard from './golfcards/golftournamentcard';
import JobRunCard from './generalcards/jobCard'
import GolfBallCard from './golfcards/golfballcard';

function App() {
    const [formValue, setFormValue] = useState('')
    const [messages, setMessages] = useState<Message[]> ([])

    function renderContent(message: Message) {
        switch (message.cardType) {
            case "string":
              return (
                <div className="flex">
                  {message.role === 'user' ? (
                    <p className={`message ${message.role} inline-block mt-8 p-2 mr-4`}>{message.content}</p>
                  ) : (
                    <p className={`message ${message.role} inline-block mt-8 p-4`}>{message.content}</p>
                  )}
                </div>
              );
            case "person":
              return (
                <div className="flex justify-start">
                  <p className="inline-block mt-8 p-4">
                    <PersonCard {...message.personCard} />
                  </p>
                </div>
              );
            case "player":
              return (
                <div className="flex justify-start">
                  <p className="inline-block mt-8 p-4">
                    <GolfPlayerCard {...message.golfPlayerCard} messages={messages} setMessages={setMessages} />
                  </p>
                </div>
              );
            case "tournament":
              return (
                <div className="flex justify-start">
                  <p className="inline-block mt-8 p-4">
                    <GolfTournamentCard {...message.golfTournamentCard} messages={messages} setMessages={setMessages} />
                  </p>
                </div>
              );
            case "job":
              if (message.jobContent && message.jobContent.length > 0) {
                return (
                  <div className="flex justify-start">
                    <p className="inline-block mt-8 p-4">
                      <JobRunCard jobs={message.jobContent} />
                    </p>
                  </div>
                );
              }
              break;
            case "ball":
              return (
                <div className="flex justify-start">
                  <p className="inline-block mt-8 p-4">
                    <GolfBallCard {...message.golfBallCard} />
                  </p>
                </div>
              );
            default:
              return null;
          }
        }        

    const newMessage: React.FormEventHandler = async(s) => {
        s.preventDefault()
        setFormValue('')
        const appendMsgs: Message[] = formValue.trim() !== '' ? [...messages, {
            role: 'user',
            content: formValue,
            cardType: "string"
        }] : messages;
        setMessages(appendMsgs)
        const response = await fetch(`http://localhost:5501/api/renderabl`, {
            method:'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: appendMsgs })
        });
        const responseMsg : Message = JSON.parse(await response.text())
        setMessages([...appendMsgs, responseMsg])
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