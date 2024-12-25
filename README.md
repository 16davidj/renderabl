# renderabl
prototype

# Rebuild frontend after changes
use the tsc --build command (Command + Shift + b with VSCode) to rebuild .ts to .js files
npx webpack (from the root component), then start Live Server on HTML

# Rebuild frontend after changes
use the tsc --build command (Command + Shift + b with VSCode) to rebuild .ts to .js files
npx webpack

# Start Redis server (before starting backend server)
redis-server

# Start backend server
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

# Example generation request
I use Postman, and create a Post request to http://localhost:5500/api/generateRenderabl, with a raw body of:
{
    "directoryPath": "/Users/David/Desktop/renderabl/src/golfcards",
    "agentName": "GolfBallAgent",
    "agentArgs": {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"name":{"type":"string"}}, "required":["name"], "additionalProperties": false},
    "agentProps": "picture_url: string, name: string, summary:string, launch_characteristics:string, spin_characteristics: string, year_introduced:number, firmness:string, players_who_used:string[]",
    "agentDescription": "A chat agent designed to show UI card components about various golf balls. Call whenever you need to respond to a prompt that asks about a golf ball. The input parameters should be the golf ball name",
    "outputPath": "/Users/David/Desktop/renderabl/src/golfcards/golfballcard.tsx"
}

{
    "directoryPath": "/Users/David/Desktop/renderabl/src/golfcards",
    "agentName": "TraficAgent",
    "agentArgs": {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"handler":{"type":"string"}, "cell":{"type":"string"}}, "required":["handler"], "additionalProperties": false},
    "agentProps": "traffic_qps: number[]",
    "agentDescription": "An agent designed to show UI card components of monitoring traffic data of a specific endpoint. Call whenever you need to respond to a prompt that asks traffic data given some parameters",
    "outputPath": "/Users/David/Desktop/renderabl/src/golfcards/trafficGraph.tsx"
}

# Example mutation request
http://localhost:5500/api/mutateRenderabl, with a raw body of:
{
    "agentName": "GolfBallAgent",
    "mutation" : "Please add to the UI component so that it can display info about the golf ball's material on the inside (eg. urethane). The field should be a string."
}

# Getters
http://localhost:5500/api/getToolGraph
http://localhost:5500/api/getContext

# Providing context
http://localhost:5500/api/provideContext

{
  "handler": [
    "SampleEndpoint",
    "GlobalEndpoint",
    "FeatureEndpoint1",
    "FeatureEndpoint2",
    "FeatureEndpoint3",
    "FeatureEndpoint4",
    "FeatureEndpoint5",
    "FeatureEndpoint6",
    "FeatureEndpoint7",
    "FeatureEndpoint8",
    "FeatureEndpoint9",
    "FeatureEndpoint10"
  ],
  "node": [
    "global-config",
    "sample-ui",
    "sample-ui-extended",
    "sample-touchstone",
    "FeatureNode1",
    "FeatureNode2",
    "FeatureNode3",
    "FeatureNode4",
    "FeatureNode5",
    "FeatureNode6",
    "FeatureNode7",
    "FeatureNode8",
    "FeatureNode9",
    "FeatureNode10"
  ],
  "cell": [
    "qs",
    "ax",
    "az",
    "bu",
    "FeatureCell1",
    "FeatureCell2",
    "FeatureCell3",
    "FeatureCell4",
    "FeatureCell5",
    "FeatureCell6",
    "FeatureCell7",
    "FeatureCell8",
    "FeatureCell9",
    "FeatureCell10"
  ],
  "component": [
    "feature1",
    "feature2",
    "FeatureComponent1",
    "FeatureComponent2",
    "FeatureComponent3",
    "FeatureComponent4",
    "FeatureComponent5",
    "FeatureComponent6",
    "FeatureComponent7",
    "FeatureComponent8",
    "FeatureComponent9",
    "FeatureComponent10"
  ]
}