# renderabl
prototype

# Build frontend
Command + Shift + b to rebuild .ts to .js files
npx webpack (from the root component), then start Live Server on HTML

# Build backend
Command + Shift + b to rebuild .ts to .js files
node ./dist/renderableBe/backend.js 

# Run tailwind
npx tailwindcss -i ./src/sampleApp/app.css -o ./src/sampleApp/output.css