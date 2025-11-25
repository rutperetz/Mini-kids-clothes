import mongoose from 'mongoose';

//Defining the structure of each product in the store
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },         
  description: { type: String, default: '' },     
  price: { type: Number, required: true },        
  imageUrl: { type: String, default: '' },        
  //category: { type: String, default: 'general' },  // קטגוריה (למשל בגדים/נעליים)
  stock: { type: Number, default: 0 },            
}, { timestamps: true });                        

// Create and export the model to the database
export const Product = mongoose.model('Product', ProductSchema);
