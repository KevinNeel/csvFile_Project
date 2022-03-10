import mongoose from "mongoose";
import j_w_t from "jsonwebtoken";
import bcrypt from "bcryptjs";

const user_Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens:[{
      token:{
          type: String,
      }
  }]
});

//generating tokens
user_Schema.methods.generateAuthToken = async function () {
  try {
    const token = j_w_t.sign({ _id: this.id.toString() }, "testproject");
    const verifyUser = j_w_t.verify(token, "testproject");
    if (verifyUser) {
      this.tokens = this.tokens.concat({token:token});
      return token;
    }
  } catch (error) {
    console.log(error);
  }
};

user_Schema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = new mongoose.model("User", user_Schema);

export default User;
