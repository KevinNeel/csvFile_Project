import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const auth = async(req,res, next)=>{
    try {
        const token = req.cookies.jwtoken;
        const verifyUser = jwt.verify(token, 'testproject');
        console.log(verifyUser)
        const user = await User.findOne({_id: verifyUser._id});
        console.log(user)
        next();
    } catch (error) {
        console.log(error)
        res.status(500).send('jwt must be provided')
    }
}