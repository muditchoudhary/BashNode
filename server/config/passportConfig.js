import { UserModel } from "../db/usersDB.js";

export function intializePassport(passport, LocalStrategy, authHandler) {
	passport.use(new LocalStrategy({ usernameField: "email" }, authHandler));

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(async function (id, done) {
		try {
			const user = await UserModel.findById(id);
			done(null, user);
		} catch (error) {
			console.error("Error in deserializeUser:\n\n", error);
			done(err);
		}
	});
}
