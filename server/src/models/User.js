import mongoose from 'mongoose';

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
      unique: true,    // שלא יהיו שני משתמשים עם אותו מייל
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,  // נשמור רק את הסיסמה המוצפנת, לא את הסיסמה עצמה
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', // כרגע כולם "user", אחר כך נעשה גם admin
    },
  },
  { timestamps: true } // יוסיף createdAt / updatedAt
);

export const User = mongoose.model('User', UserSchema);
