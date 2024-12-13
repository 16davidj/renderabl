# renderabl
prototype

# Build frontend
Command + Shift + b to rebuild .ts to .js files
npx webpack (from the root component), then start Live Server on HTML

# Build backend
Command + Shift + b to rebuild .ts to .js files
node ./dist/renderableBe/backend.js 

# Run tailwind (whenever there is a styling change)
npx tailwindcss -i ./src/sampleApp/app.css -o ./src/sampleApp/output.css

# Directory breakdown
/src/generalcards contains .tsx UI cards that I was experimenting with before I narrowed down to the golf vertical for the MVP.

/src/golfcards contains .tsx UI cards that I've created. golfballcard.tsx was generated via a call to generateComponent in backend.ts, and golfplayercard.tsx and golftournamentcard.tsx were created manually.

/src/renderableBe contains backend.ts, which contains both the backend for the app.tsx I created, as well as backend functions that would live in the Renderabl service. I did this out of ease of just starting up one local server for development. fakedb.ts is where I put KV pairs that I would normally put in a DB.

/src/renderableFe contains renderableFeUtils.ts, which contains helper logic that builds out the functionality of Renderable FE by automating card generation and mutations (eventually).

/src/sampleApp is a sample chatbot that takes in prompts and responds with UI cards. This would normally be an example of a client company which has an app that takes in text prompts, and want UI cards. I just happend to create a sample app so that I can pretend to be the client, and have a better understanding of what part of the workflows I can automate with Renderabl FE and BE.

/src/types.ts contains all the types and props.