import { Schema, model } from 'mongoose';


interface ChatMessage {
    userId: string;
    projectId:string;
    message: string;
    response:string;
    date:string;
    time:string;
    modelType:string;
    role:string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<ChatMessage>({
    userId: { type: String, required: true},
    projectId:{ type: String},
    message: { type: String ,required:true},
    response: { type: String },
    date:{ type: String },
    time:{ type: String },
    modelType:{type: String },
    role:{ type: String , default:"user" },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },

}, {
    timestamps: true,
    versionKey: false
});
schema.index({ userId: 1, isDelete: 1 });
const chatMessageModel = model<ChatMessage>('chat_messages', schema);
export = chatMessageModel
