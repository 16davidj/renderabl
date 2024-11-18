import React from 'react'

/**
 * The main app component.
 * 
 * Displays a basic chatbot interface.
 * 
 * @returns The JSX for the app component.
 */

function App() {
    console.log('App component rendered');
    return (<main>
        <h1> [insert name here] chatbot </h1>
        <div>
            <p>Start your renderabl chat here!</p>
        </div>
        <form>
            <input type="text" placeholder="Enter your message here!" />
            <input type="submit" value="Send" />
        </form>
    </main>);
}

export default App