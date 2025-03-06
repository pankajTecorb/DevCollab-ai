import { Schema, model } from 'mongoose';


interface Project {
    userId:string;
    projectId:string;
    name: string;
    description: string;
    role:string;
    members:[];
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Project>({
    userId: { type: String, required: true },
    projectId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    role: { type: String },
    members: [{}],
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },

}, {
    timestamps: true,
    versionKey: false
});
schema.index({ name: 1, isDelete: 1 });
const projectModel = model<Project>('Project', schema);
export = projectModel
