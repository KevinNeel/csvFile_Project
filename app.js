import express from "express";
const app = express();
import upload from "./upload.js";
import connDB from "./db_conn/db_conn.js";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import jwt from "jsonwebtoken";


connDB();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

import {
  uploadCSVFile,
  userSignUp,
  userLogin,
  getUsersList,
  getUserDetails,
  getProductList,
} from "./controllers/user_Controller.js";

import{auth} from "./middleware/auth.js"

app.get("/csvfile", auth, (req, res) => {
  res.status(200).render("csvfile");
});

app.get("/", (req, res) => {
  res.status(200).render("login");
});

app.get("/signUp", (req, res) => {
  res.status(200).render("signUp");
});



app.get('/index', (req,res)=>{
  res.render('index')
})

app.get("/getUsersList", getUsersList);

app.get("/getUserDetails/:userID", getUserDetails);

app.get('/productList', getProductList)

app.post("/", userLogin);

app.post("/signUp", userSignUp);

app.post("/csvfile", auth,upload.single("csv"), uploadCSVFile);

//assign port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server run at port " + port));
