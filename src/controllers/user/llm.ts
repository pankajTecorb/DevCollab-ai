import { userModel, chatMessageModel, adminModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import Groq from "groq-sdk";
import { ChatGroq } from "@langchain/groq"; // Correct import for Groq
import { BufferMemory } from "langchain/memory"; // Ensure this is the latest
import { ConversationChain } from "langchain/chains"; // Proper import for memory usage
import dayjs from "dayjs";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


//const memory = new BufferMemory(); // Stores message history

// Initialize Groq model
// const chatModel = new ChatGroq({
//     apiKey: process.env.GROQ_API_KEY, // Get your Groq API Key
//     modelName: "llama-3.3-70b-versatile",  // Select Groq Model
//     maxTokens: 500
// });

// LangChain conversation setup
// const chain = new ConversationChain({
//     llm: chatModel,
//     memory: memory, // Maintain conversation history
// });
// const memory = new BufferMemory({
//     memoryKey: "history", // Stores chat history
//     returnMessages: true, // Keeps messages as objects instead of plain text
//   });

import { ChatPromptTemplate } from "@langchain/core/prompts";

// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You are a world class technical code writer."],
//   ["user", "{input}"],
// ]);
// const chain = prompt.pipe(chatModel);
// await chain.invoke({
//     input: "what is LangSmith?",
//   });




// Initialize Memory
const memory = new BufferMemory({
    memoryKey: "history", // Stores chat history
    returnMessages: true, // Keeps messages as objects instead of plain text
  });
  
  // Initialize the Chat Model (Groq LLM)
  const chatModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: "llama-3.3-70b-versatile",
    maxTokens: 500,
    temperature:0.6
  });
  
  // Define Prompt Template with History
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a world-class technical code writer. Always provide clear, structured, and optimized code solutions. If the user asks for step-by-step guidance, break it down with numbered steps before showing the code."],
    ["system", "If a question requires an example, provide a simple but effective example first, then expand if needed."],
    ["system", "If the user asks for improvements, suggest optimizations and best practices."],
    ["user", "{history}"],  // Load chat history
    ["user", "{input}"],   // Current user input
  ]);
  
  // Create a conversation chain with memory
  const chain = new ConversationChain({
    llm: chatModel,
    prompt: prompt,
    memory: memory, // Attach Memory
  });
/**
 * User chat
 * 
 * @param body 
 * @returns 
 */
function groqChat(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { query ,projectId,modelType,role="user"} = body
            if (!query) {
                reject(new CustomError(errors.en.noQuery, StatusCodes.NOT_FOUND))
            } else {
                if(role=="user"){
                    const userData = await userModel.findOne({ _id: userId, isDelete: false })
                    if (!userData) {
                        reject(new CustomError(errors.en.noDatafound, StatusCodes.NOT_FOUND))
                    } else {
                        // const response = await main(query)
                        const response = await chain.call({ input: query });
                        // const response = await chain.invoke({
                        //         input: query,
                        //       });
                        const messageObj = {
                            userId: userId,
                            role:'user',
                            message: query,
                            projectId:projectId,
                            modelType:modelType,
                            response: response.response,
                            date: dayjs().format("YYYY-MM-DD"),
                            time: dayjs().format("HH:mm")
                        }
                        const chatmessage = await chatMessageModel.create(messageObj)
                        resolve(response)
                    }
                }else{
                    const adminData = await adminModel.findOne({ _id: userId, isDelete: false })
                    if (!adminData) {
                        reject(new CustomError(errors.en.noDatafound, StatusCodes.NOT_FOUND))
                    } else {
                        const response = await chain.call({ input: query });
                        const messageObj = {
                            userId: userId,
                            role:'admin',
                            message: query,
                            projectId:projectId,
                            modelType:modelType,
                            response: response.response,
                            date: dayjs().format("YYYY-MM-DD"),
                            time: dayjs().format("HH:mm")
                        }
                        const chatmessage = await chatMessageModel.create(messageObj)
                        resolve(response)
                    } 
                }
                
            }
        } catch (err) {
            reject(err)
        }
    });
}

/**
 * User Chat List 
 * 
 * @param query 
 * @returns 
 */
function userChatList(query: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, pageSize = 10, search, fromDate,projectId, toDate ,role} = query;
            let condition: any = {
                isDelete: false,
                userId: userId,
                role:role
            };
            if (projectId && projectId != "") {
                condition = {
                    ...condition,
                    projectId: projectId
                }
            }
            if (search && search != "") {
                condition = {
                    ...condition,
                    $or: [
                        { message: { $regex: search, $options: "i" } },
                    ],
                };
            }
            if (fromDate && fromDate != null && fromDate != undefined && fromDate != "" || toDate && toDate != null && toDate != undefined && toDate != "") {
                condition = {
                    ...condition,
                    createdAt: { $gte: fromDate, $lte: toDate }
                }
            }
            console.log(condition,"dj")
            const response = await chatMessageModel.aggregate([
                { $match: condition },
                { $sort: { createdAt: -1 } },
                { $skip: Number(page - 1) * Number(pageSize) },
                { $limit: Number(pageSize) },
                {
                    $project: {
                        isDelete: 0, updatedAt: 0,
                    }
                }
            ]);
            const total = await chatMessageModel.aggregate([
                { $match: condition },
                {
                    $project: {
                        _id: 1, userId: 1,
                    }
                }
            ]);
            if (response.length > 0) {
                resolve({response,Total:total.length})
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

async function main(query: string) {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [{
            "role": "user",
            "content": query
        },],
        "model": "deepseek-r1-distill-llama-70b",
        "temperature": 0.4,
        "max_completion_tokens": 500,
        "top_p": 1,
        "stream": true,
        "stop": null
    });
    let fullResponse = "";
    for await (const chunk of chatCompletion) {
        const textChunk = chunk.choices[0]?.delta?.content || '';
        fullResponse += textChunk; // Append chunk to full response
    }
    return fullResponse;
}










// Export default
export default {
    groqChat,
    userChatList
} as const;
