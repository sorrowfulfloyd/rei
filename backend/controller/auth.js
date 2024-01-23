const User = require("../models/users");
const { hashPassword, compareHashes } = require("../crypt/crypt");
const findBy = require("../auth/findBy");
const { validateToken, createToken } = require("../auth/jwt");

const register = async (req, res) => {
	// console.log(req.body);
	if (!req.body.email) {
		return res.status(400).json("No email given");
	}
	if (!req.body.username) {
		return res.status(400).json("No username given");
	}
	if (!req.body.password) {
		return res.status(400).json("No password given");
	}

	if (await findBy.Email(req.body.email)) {
		// console.log(`[DEBUG (register.js)] - ${req.body.email} is already taken!`);
		return res.status(400).json({
			message: "[ERROR] An user with provided email is already registered!",
			email: req.body.email,
		});
	}
	if (await findBy.Username(req.body.username)) {
		// console.log( `[DEBUG (register.js)] - ${req.body.username} is already taken!`,);
		return res.status(400).json({
			message: "[ERROR] An user with provided username is already registered!",
			username: req.body.username,
		});
	}
	// console.log("[DEBUG (register.js)] - Registering the user...");
	const userInfo = new User({
		username: req.body.username,
		email: req.body.email,
		password: await hashPassword(req.body.password),
	});
	await userInfo.save();
	// console.log( `[DEBUG (register.js)] - User has been saved successfully. Email: '${userInfo.email}', username: '${userInfo.username}'`,);
	return res.status(200).json({
		message: "User has been registered successfully.",
		userInfo: [userInfo.username, userInfo.email],
	});
};

const login = async (req, res) => {
	// console.log("Recieved a login request!");
	const user = await findBy.Username(req.body.username, true);
	// console.log(user);
	if (!user) {
		// console.log( `[DEBUG (login.js)] - Someone tried to sign-in with an unknown username. Redirect them to register page! Username: ${req.body.username}`,);
		res
			.status(404)
			.json({ message: "Invalid credentials, please sign-up first." });
	} else {
		// const isSigned = await User.findOne({ username: req.body.username })
		// if (isSigned.signedIn) {
		//   console.log(`[DEBUG (login.js)] - A user that's already marked as signed-in in the database is trying to sign-in again. Blocking... Username: '${req.body.username}'`);
		//   return res.status(400).json({ status: 400, msg: `User: ${req.body.username} is already signed in!` })
		// }
		// console.log("[DEBUG (login.js)] - Username is right, proceeding..");
		const result = await compareHashes(req.body.password, user);
		if (result) {
			// await User.findOneAndUpdate({ username: req.body.username }, { signedIn: true })
			const token = createToken(req.body.username);
			// console.log( "[DEBUG (login.js)] - Password is also right and checks OK with the hash in the DB, RETURNING TOKEN -->\n", token,);
			return res.status(200).json({ token: token });
		}
		// console.log( "[DEBUG (login.js)] - Hash comparison is failed, password given is wrong",);
		return res.status(404).json({ message: "Wrong password" });
	}
};

const token = async (req, res) => {
	if (!validateToken(req.header("token"))) {
		return res.status(400).json({ message: "Token is invalid" });
	}
	return res.status(200).json({ message: "Token is validated" });
};

module.exports = { register, login, token };
