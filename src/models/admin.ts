import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface Admin {
  name: string;
  email:string;
  countryCode:string;
  phoneNumber:string;
  image:string;
  password:string;
  token:string;
  role:string;
  isActive: boolean;
  isDelete: boolean;

}

const schema = new Schema<Admin>({
  name: { type: String, required: true },
  password: { type: String  },
  email:{type : String , required:true ,unique:true},
  countryCode:{type:String},
  phoneNumber :{type : String },
  image :{type : String },
  token:{ type: String},
  role:{ type: String},
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
 
}, {
    timestamps: true,
    versionKey: false
});

schema.index({ email:1,isDelete:1});
const adminModel = model<Admin>('Admin', schema);
export = adminModel