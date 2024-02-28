import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  // Run query with the user's email and username as parameters
  db.query(query, [req.body.email, req.body.username], (err, data) => {

    if (err) return res.json(err);
    // If the query returns data, it means the user already exists, return a 409 conflict status code
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password and create a user
    // Generate a salt value
    const salt = bcrypt.genSaltSync(10);
    // Generate a hash value using the password and the salt value
    const hash = bcrypt.hashSync(req.body.password, salt);

    const query = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(query, [values], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const isPassCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPassCorrect) {
      return res.status(400).json("Error in name or password");
    }

    //create a JSON web token
    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    // Remove the password from the user data
    const { password, ...userData } = data[0];

    // Set the token as a http-only cookie and send user data as response
    res.cookie("jwt_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(userData);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("jwt_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("succes logout");
};