import mongoose from 'mongoose';

const product_Schema = new mongoose.Schema({
    name:{
        type: String,
    },
    description:{
        type: String
    },
    quantity:{
        type: String
    },
    price:{
        type: Number
    },
    _createdBy:{
        type: String
    }
});

const product = mongoose.model('product', product_Schema);

export default product;