const user_directory = "./data/users.json";
const transactions_directory = "./data/transactions.json";

const fs = require("fs");
module.exports = (amount, curr_user_id, current_index, req, res) => {
  console.log(req.session);
  if (!req.session.current_user_id) {
    return res.redirect("/"); // Redirect to the login page if session ID doesn't exist
  }
  if (amount <= 0) {
    return res
      .status(400)
      .send("Entered amount can't be less than or equal to 0");
  }
  const usersData = fs.readFileSync(user_directory);
  const users = JSON.parse(usersData);
  users[curr_user_id - 1]["amount"] =
    Number(users[curr_user_id - 1]["amount"]) + Number(amount);
  fs.writeFileSync(user_directory, JSON.stringify(users));

  const transactions = fs.readFileSync("./data/transactions.json");
  const userTransactions = JSON.parse(transactions);
  const userTransaction = userTransactions.find(
    (user_id) => Object.keys(user_id)[0] == users[curr_user_id - 1]["user_id"]
  );
  if (!userTransaction) {
    var obj = {};
    // User doesn't exist, create a new user and add it to the users array
    obj[users[curr_user_id - 1]["user_id"]] = [
      {
        index: current_index,
        added_amount: amount,
        current_amount: users[curr_user_id - 1]["amount"],
        date: new Date().toISOString(),
      },
    ];
    current_index += 1;
    userTransactions.push(obj);

    // Save the updated user data to the file
    fs.writeFileSync(transactions_directory, JSON.stringify(userTransactions));
    return res.redirect("/dashboard");
  }
  // UserTransaction exists then add new transaction to the user
  var obj = {
    index: current_index,
    added_amount: amount,
    current_amount: users[curr_user_id - 1]["amount"],
    date: new Date().toISOString(),
  };
  userTransaction[users[curr_user_id - 1]["user_id"]].push(obj);
  userTransactions[userTransaction["current_index"]] = userTransaction;
  fs.writeFileSync(transactions_directory, JSON.stringify(userTransactions));

  return res.redirect("/dashboard");
};
