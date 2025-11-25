import mongoose from 'mongoose';

//System user structure
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,    //No 2 users have the same email
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,  //Saves encrypted password
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', //User type - ADMIN definition will be done manually
    },
  },
  { timestamps: true } 
);

export const User = mongoose.model('User', UserSchema);
