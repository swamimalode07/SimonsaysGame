const { User } = require("../Models/userModel.cjs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).json({ message: "Invalid username or password" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashPassword
    });
    await newUser.save();
    res.status(201).redirect("/login");
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server error");
  }
};

const login = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.redirect("/register");
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production"
        });

        res.redirect("/main?username=" + encodeURIComponent(username));
      });
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Server error");
    });
};

const updateLevel = (req, res) => {
  const username = req.body.username;
  const currentLevel = parseInt(req.body.currentLevel, 10);

  if (isNaN(currentLevel)) {
    return res.status(400).send("Invalid level provided.");
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found.");
      }

      if (currentLevel > user.maxLevel) {
        user.results.push({ score: currentLevel });
        user.maxLevel = currentLevel;
        return user.save().then(() => {
          res.status(200).send("Max level updated successfully!");
        });
      } else {
        user.results.push({ score: currentLevel });
        return user.save().then(() => {
          res.status(200).send("Max level updated successfully!");
        });
      }
    })
    .catch((err) => {
      res.status(500).send("Error updating max level.");
    });
};

const main = (req, res) => {
  res.render("main", { query: req.query });
};

const leaderboard = (req, res) => {
  User.find()
    .sort({ maxLevel: -1 })
    .then((users) => {
      res.render("leaderboard", { users, username: req.query.username });
    })
    .catch((err) => {
      res.status(500).send("Error retrieving leaderboard.");
    });
};

const userLeaderboard = (req, res) => {
  User.findOne({ username: req.query.user })
    .then((currentUser) => {
      if (!currentUser) {
        console.log(currentUser);
        return res.status(404).send("User not found.");
      }
      res.render("userLeaderboard", {
        currentUser,
        username: req.query.username
      });
    })
    .catch((err) => {
      res.status(500).send("Error retrieving leaderboard.");
    });
};

module.exports = {
  login,
  updateLevel,
  main,
  leaderboard,
  userLeaderboard,
  register
};
