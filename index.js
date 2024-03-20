const dotenv = require('dotenv')
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let jwtkey = 'e-comm'
const cookieParser = require('cookie-parser');
const EmployeeModel = require("./models/Employee.jsx");

const port = 3001 || process.env.BASE_URL 

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL);

app.post("/login", async (req, res) => {
  if(req.body.email && req.body.password){
    let user = await EmployeeModel.findOne({ email: req.body.email }).select("-password")
    let hashString = JSON.stringify(
      await EmployeeModel.findOne({email:req.body.email}).select("password")
    )

    async function validatePassword(plainText,hash){
      let result = await bcrypt.compare(plainText,hash)
      return result
    }

    if(user && validatePassword(req.body.password,hashString)){
      jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{
         if(err){
          res.send("Something went wrong, Please try after somtime");
         }
         else{
          res.send({ user, auth: token });
         }
      })
    }else res.send({ result: "No User Found!" });
  } else res.send({ result: "No User Found!" });
});

app.post("/register", async (req, res) => {

  let user = new EmployeeModel(req.body);
  let check = await EmployeeModel.findOne({ email: req.body.email }).select("-password");
  if (check != null) res.send(false);
  else{
    let result = await user.save();
    // console.log(result);
    result = result.toObject();
    delete result.password;
    jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
      if (err) res.send("Something went wrong, Please try after somtime");
      else res.send({ result, auth: token });
    });
  }
});

app.listen(port, () => {
  console.log("Server is running on port 3001");
});
