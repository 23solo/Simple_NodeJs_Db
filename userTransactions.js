const fs = require("fs");
const transactions_directory = "./data/transactions.json";
const user_directory = "./data/users.json";
module.exports = (req, res) => {
  if (!req.session.current_user_id) {
    return res.redirect("/"); // Redirect to the login page if session ID doesn't exist
  }
  const usersData = fs.readFileSync(user_directory);
  const users = JSON.parse(usersData);
  const curr_user_id = req.session.current_user_id;
  const transactions = fs.readFileSync(transactions_directory);
  const userTransactions = JSON.parse(transactions);
  const userTransaction = userTransactions.find(
    (user_id) => Object.keys(user_id)[0] == users[curr_user_id - 1]["user_id"]
  );
  if (!userTransaction) {
    return res.status(404).send("No Transactions Found");
  }
  return res.status(200).send(userTransaction);
};
