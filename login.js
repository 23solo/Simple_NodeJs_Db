const bcrypt = require("bcrypt");
const fs = require("fs");
const user_directory = "./data/users.json";
module.exports = (user_ids, req, res) => {
  const { user_id, password } = req.body;

  // Read the existing user data from a file
  const usersData = fs.readFileSync(user_directory);
  const users = JSON.parse(usersData);

  // Check if the user exists
  const user = users.find((user) => user.user_id === user_id);
  if (!user) {
    // User doesn't exist, create a new user and add it to the users array
    const newUser = {
      user_ids: user_ids,
      user_id: user_id,
      password: bcrypt.hashSync(password, 10),
      amount: 0,
    };
    users.push(newUser);

    // Save the updated user data to the file
    fs.writeFileSync(user_directory, JSON.stringify(users));

    // Successful user creation
    req.session.current_user_id = user_ids;

    user_ids += 1;
    return res.redirect("/dashboard");
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).send("Invalid user credentials");
    }

    // Successful login
    req.session.current_user_id = user.user_ids;
    return res.redirect("/dashboard");
  });
};
