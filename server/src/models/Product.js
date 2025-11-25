import mongoose from 'mongoose';

//Defining the structure of each product in the store
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },         // שם המוצר
  description: { type: String, default: '' },      // תיאור קצר
  price: { type: Number, required: true },         // מחיר
  imageUrl: { type: String, default: '' },         // קישור לתמונה
  //category: { type: String, default: 'general' },  // קטגוריה (למשל בגדים/נעליים)
  stock: { type: Number, default: 0 },             // כמות במלאי
}, { timestamps: true });                           // שומר תאריכי יצירה/עדכון

// Create and export the model to the database
export const Product = mongoose.model('Product', ProductSchema);
