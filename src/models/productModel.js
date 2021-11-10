const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {type:String, required:true},
  brand: {type:String, required:true},
  color: {type:String, required:true},
  size: {type:String, required:true},
},{
    versionKey:false,
    timestamps:true
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
