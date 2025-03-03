import { Schema, model } from 'mongoose';


interface Project {
    name: string;
    description: string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Project>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },

}, {
    timestamps: true,
    versionKey: false
});
schema.index({ name: 1, isDelete: 1 });
const projectModel = model<Project>('Project', schema);
export = projectModel
