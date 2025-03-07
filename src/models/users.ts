import { Schema, model } from 'mongoose';


interface User {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  image: string,
  role: string;
  designation: string;
  isPhoneVerified: boolean;
  isActive: boolean;
  isDelete: boolean;

}

const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String },
  phoneNumber: { type: String },
  countryCode: { type: String },
  image: { type: String },
  role: { type: String },
  isPhoneVerified: { type: Boolean, default: true },
  designation: { type: String },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },

}, {
  timestamps: true,
  versionKey: false
});
schema.index({ email: 1, isDelete: 1 });
const userModel = model<User>('User', schema);
export = userModel
