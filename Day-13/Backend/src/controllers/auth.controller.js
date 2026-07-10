import { data } from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @route POST api/auth/register
 * @description Registers an user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function registerController(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Fill all fields correctly !",
    });
  }

  const userAlreadyExist = data.find((info) => {
    return info.email === email || info.username === username;
  });

  if (userAlreadyExist) {
    return res.status(400).json({
      success: false,
      message: "User with email or username already exists",
    });
  }

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  data.push({
    username,
    email,
    password: hashPassword,
  });

  const token = jwt.sign(
    {
      email,
      username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  return res.status(201).json({
    success: true,
    message: "User registered successfully !",
    user:{
      username,
      email,
      password:hashPassword
    },
  });
}

/**
 * @route POST api/auth/login
 * @description Logins an user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function loginController(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Fill all fields correctly !",
    });
  }

  const userExist = data.find((info) => {
    return info.email === email;
  });

  if (!userExist) {
    return res.status(400).json({
      success: false,
      message: "User doesn't exist !",
    });
  }

  const validPassword = await bcrypt.compare(password, userExist.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  return res.status(201).json({
    success: true,
    message: "User Logged in successfully !",
    user:userExist,
  });
}

/**
 * @route POST api/auth/logout
 * @description Logs out a user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function logoutController(req, res) {
  const {email} = req.user
  const user = data.find((info)=>{
    return info.email===email
  })
  res.clearCookie("token")
  return res.status(200).json({
    success:true,
    message: "User logged out successfully ",
    user
  })
}
