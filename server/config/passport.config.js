import dotenv from "dotenv";

dotenv.config();

export const intializePassport = (
	passport,
	JwtStrategy,
	ExtractJwt,
	verfifyAuth
) => {
	let jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = process.env.JWT_SECRET;

	const strategy = new JwtStrategy(jwtOptions, verfifyAuth);

	passport.use(strategy);
};
