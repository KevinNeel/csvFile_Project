import mongoose from 'mongoose';

const connDB = () => {mongoose.connect('mongodb://localhost/csvfile',  {
    useNewUrlParser: true,
}).then(()=>{
    console.log("Connection is Successfull!")
}).catch((err)=>{
    console.log("Connection is Unsccessfull!", err)
})};

export default connDB