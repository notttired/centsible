const {
  getFolders,
  storeFolders,
  getItems,
  storeItems,
} = require("./src/database/queries.js");
const jwt = require("jsonwebtoken");
const path = require("path");
const express = require("express");
const session = require("express-session");
require("./src/auth/authentication.js");
const passport = require("passport");
require("dotenv").config();
require("./src/database/initializedb.js"); // is this the correct pathing?

const app = express();
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json()); // parses req.bodies

app.use("/", express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.post("/auth/jwt", (req, res) => {
  try {
    const isVerified = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json(isVerified);
  } catch (error) {
    console.error("JWT verification error:", error);
    res.json(false);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    console.log("Creating Token");
    const token = jwt.sign(
      { username: req.user.displayName },
      `${process.env.ACCESS_TOKEN_SECRET}`
    );
    res.redirect(`/?token=${token}`); // added /
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("An error occurred during logout.");
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Error destroying session:", sessionErr);
        return res
          .status(500)
          .send("An error occurred while ending the session.");
      }
      res.send("Goodbye!");
    });
  });
});
app.listen(5000, () => {
  console.log("Running on 5000");
});

function authorize(req, res, next) {
  console.log("authorizing");
  try {
    const isVerified = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    );
    isVerified ? next() : res.status(400).json("Error");
  } catch (error) {
    res.status(400).json("Error");
  }
}

// req body must contain token, type: one of four functions,
app.post("/db", authorize, async (req, res) => {
  const type = req.body.type;
  const parameters = req.body.params;
  if (type === "getFolders") {
    console.log(parameters);
    console.log(await getFolders(parameters.userID));
    res.json(await getFolders(parameters.userID));
  } else if (type === "getItems") {
    res.json(await getItems(parameters.userID, parameters.folderName));
  } else if (type === "storeFolders") {
    await storeFolders(parameters.userID, parameters.foldersList);
    res.sendStatus(200);
  } else if (type === "storeItems") {
    await storeItems(
      parameters.userID,
      parameters.folderName,
      parameters.itemsList
    );
    res.sendStatus(200);
  }
});
// may need to await
