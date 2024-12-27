// 'use client'
// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// interface Tool {
//   id: string
//   name: string
//   description: string
// }
// export default function FunctionCallingDeciderTab() {
//   const [tools, setTools] = useState<Tool[]>([])
//   const [prompt, setPrompt] = useState('')
//   const [decision, setDecision] = useState<string | null>(null)
//   useEffect(() => {
//     // Fetch existing tools
//     fetch('/api/tools')
//       .then(res => res.json())
//       .then(data => setTools(data))
//   }, [])
//   const handleDecide = () => {
//     fetch('/api/decide', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ prompt })
//     })
//       .then(res => res.json())
//       .then(data => setDecision(data.toolId))
//       .catch(err => console.error('Error making decision:', err))
//   }
//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold">Function Calling Decider</h2>
//       <div className="grid grid-cols-3 gap-4">
//         {tools.map(tool => (
//           <Card key={tool.id} className={decision === tool.id ? 'border-primary' : ''}>
//             <CardHeader>
//               <CardTitle>{tool.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>{tool.description}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//       <div className="flex space-x-2">
//         <Input
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Enter your prompt here"
//         />
//         <Button onClick={handleDecide}>Decide</Button>
//       </div>
//     </div>
//   )
// }
//# sourceMappingURL=functionDeciderTab.js.map
//# sourceMappingURL=functionDeciderTab.js.map