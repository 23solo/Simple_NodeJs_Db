const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const addAmount = require("./addAmount");
const login = require("./login");
const userTransaction = require("./userTransactions");
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

var user_ids = 1;
var current_index = 0;

app.get("/", (req, res) => {
  if (req.session.current_user_id) {
    return res.redirect("/dashboard"); // Redirect to the dashboard page if session ID does exist
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/add_amount", (req, res) => {
  const amount = req.body.amount * 2;
  const curr_user_id = req.session.current_user_id;
  return addAmount(amount, curr_user_id, current_index, req, res);
});

app.get("/logout", (req, res) => {
  req.session.current_user_id = null;
  res.redirect("/");
});

app.post("/login", (req, res) => {
  return login(user_ids, req, res);
});

app.get("/dashboard", (req, res) => {
  if (!req.session.current_user_id) {
    return res.redirect("/"); // Redirect to the login page if session ID doesn't exist
  }
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/user_transactions", (req, res) => {
  return userTransaction(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
