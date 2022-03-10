import path from "path";
import csv from "csvtojson";
import product from "../models/products.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

export const uploadCSVFile = async (req, res) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (jsonObj) => {
        //finding the document using fileName and setting csvData as the jsonObj
        console.log(jsonObj);
        const createObj = await product.create(jsonObj);
        res.send(createObj);
      });
  } catch (error) {
    console.log(error);
  }
};

export const userSignUp = async (req, res) => {
  try {
    const {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
    } = req.body;
    const findUser = await User.findOne({ username: username }).lean();
    if (findUser) {
      res.status(400).send("Username already exist!");
    } else {
      const saveUser = await User({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
      });
      const token = await saveUser.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 2000000),
        httpOnly: true,
      });
      if (token) {
        const userDetails = await saveUser.save();
        res.status(200).json(userDetails);
      } else {
        res.status(500).send("Something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password: password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(500).send({ message: "invalid credentials" });
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const token = await user.generateAuthToken();
        const saveToken = await User.findOneAndUpdate(
          { _id: user.id },
          {
            $push: {
              tokens: [{
                token: token
              }],
            },
          }
        );
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 2000000),
          httpOnly: true,
        });
        res.status(200).render("index");
      } else {
        res.status(500).send({ message: "invalid credentials" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const getUsers = await User.find();
    console.log(getUsers);
    res.status(200).json(getUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userID = req.params.id; //copy the id of user from databse and paste here
    const getUser = await User.findById(userID);

    console.log(getUser);
    res.status(200).json(getUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getProductList = async (req, res) => {
  try {
    const products = await product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error);
  }
};
