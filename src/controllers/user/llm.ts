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


const memory = new BufferMemory(); // Stores message history

// Initialize Groq model
const chatModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY, // Get your Groq API Key
    modelName: "llama-3.3-70b-versatile",  // Select Groq Model
    maxTokens: 500
});

// LangChain conversation setup
const chain = new ConversationChain({
    llm: chatModel,
    memory: memory, // Maintain conversation history
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
            const { query ,role="user"} = body
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
                        const messageObj = {
                            userId: userId,
                            role:'user',
                            message: query,
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
            const { page = 1, pageSize = 10, search, fromDate, toDate } = query;
            let condition: any = {
                isDelete: false,
                userId: userId
            };

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
            if (response.length > 0) {
                resolve(response)
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
