const JWT = require("jsonwebtoken");

const secret = "$ecretToke#";

function createTokenForUser(user) {
	const payload = {
		id: user._id,
		email: user.email,
		profileImageUrl: user.profileImageURL,
		role: user.role,
	};
	const token = JWT.sign(payload, secret);
	return token;
}

function validateToken(token) {
	const payload = JWT.verify(token, secret);
	return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};
