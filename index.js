import { webcrypto } from "node:crypto";
if (!globalThis.crypto) {
    globalThis.crypto = webcrypto;
}

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation ,StateGraph } from "@langchain/langgraph";
import { ToolMessage } from "@langchain/core/messages";
import { config } from "dotenv";
config();
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
});

const multiply = tool(
    async ({ a, b }) => {
        return a * b;
    },
    {
        name: "multiply",
        description: "Multiply a and b",
        schema: z.object({
            a: z.number(),
            b: z.number(),
        }),
    }
);

const add = tool(
    async ({ a, b }) => {
        return a + b;
    },
    {
        name: "add",
        description: "Add a and b",
        schema: z.object({
            a: z.number(),
            b: z.number(),
        }),
    }
);


const subtract = tool(
    async ({ a, b }) => {
        return a - b;
    },
    {
        name: "subtract",
        description: "Subtract b from a",
        schema: z.object({
            a: z.number(),
            b: z.number(),
        }),
    }
);


const divide = tool(
    async ({ a, b }) => {
        return a / b;
    },
    {
        name: "divide",
        description: "Divide a by b",
        schema: z.object({
            a: z.number(),
            b: z.number(),
        }),
    }
);

const tools = [multiply, add, subtract, divide];
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = llm.bindTools(tools);

async function llmcall(state){
    const result = await llmWithTools.invoke([{
        role :'system',
        content:'Concise math helper.'
    },...state.messages]);
    return {messages:[result]};
    
}
async function toolNode(state){
 const result =[];
 const lastMessage  = state.messages.at(-1)
 
 if(lastMessage?.tool_calls?.length){
    for (const call of lastMessage.tool_calls){
     const tool = toolsByName[call.name];
     const observation = await tool.invoke(call.args);
     result.push(new ToolMessage({
        content : typeof observation === "string" ? observation : JSON.stringify(observation),
        name: call.name,
        tool_call_id : call.id,
     }))
    }
 }
 return {messages: result}
}
function shouldContinue(state){
    const lastMessage = state.messages.at(-1)
    if(lastMessage?.tool_calls?.length){
        return 'tools'
    }
    return '__end__';
}
const agentBuilder = new StateGraph(MessagesAnnotation) 
.addNode('llmCall',llmcall)
.addNode('tools',toolNode)
.addEdge('__start__','llmCall')
.addConditionalEdges('llmCall',shouldContinue,
    {
    "tools":"tools",
    "__end__":"__end__"
   }
)
.addEdge("tools","llmCall")
 .compile();


 const messages = [
    {
        role:'user',
        content:'what is the result of 2234*23431',
    },
 ];
 const result = await agentBuilder.invoke({messages: messages});

 console.log(result.messages);