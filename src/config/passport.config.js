import passport from "passport";
import GitHubStrategy from "passport-github2"
import usersModel from "../dao/dbManager/models/user.model.js";
import local from "passport-local"
import { createHash , isValidPassword } from '../util.js'
import { passportStrategiesEnum } from './enums.js'
import jwt from'passport-jwt'
import configs from "../config.js";

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

// User and Password authentication
const LocalStrategy = local.Strategy;

export const initializePassport = () => {
	passport.use(
		passportStrategiesEnum.JWT,
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
				secretOrKey: configs.privateKeyJWT
			},
			async (jwt_payload, done) => {
				try {
					return done(null, jwt_payload.user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);


	// GITHUB authentication
	passport.use(
		passportStrategiesEnum.GITHUB,
		new GitHubStrategy(
			{
				clientID: configs.clientID,
				clientSecret: configs.clientSecret,
				callbackURL: "http://localhost:8080/api/sessions/github-callback",
				scope: ["user:email"]
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const email = profile.emails[0].value;
					const user = await usersModel.findOne({ email });
					
					if (!user) {
						const newUser = {
							first_name: profile._json.name,
							last_name: "",
							age: 18,
							email,
							password: "A1B2c3",
							role: "user"
						};
						const result = await usersModel.create(newUser);
						return done(null, result);
					} else {
						return done(null, user);
					}
				} catch (error) {
					console.log(error);
					return done("Incorrect credentials");
				}
			}
		)
	);


	// Local authentication
	passport.use(
		"local-register",
		new LocalStrategy(
			{
				passReqToCallback: true, 
				usernameField: "email"
			},
			async (req, username, password, done) => {
				try {
					const { first_name, last_name, age } = req.body;

					const user = await usersModel.findOne({ email: username });
					if (user) {
						return done(null, false);
					}
					const hashedPassword = createHash(password);
					const userToSave = {
						first_name,
						last_name,
						email: username,
						age,
						password: hashedPassword,
						role: "user"
					};
					const result = await usersModel.create(userToSave);
					return done(null, result); 
				} catch (error) {
					return done("Incorrect credentials");
				}
			}
		)
	);


	// Local login
	passport.use(
		"local-login",
		new LocalStrategy(
			{
				usernameField: "email"
			},
			async (username, password, done) => {
				try {
					if (
						username.trim() === "adminCoder@coder.com" &&
						password === "adminCod3r123"
					) {
						const user = {
							_id: 1,
							first_name: `Admin`,
							last_name: "Coder",
							email: username,
							role: "admin"
						};
						return done(null, user);
					}
					const user = await usersModel.findOne({ email: username });
					const validPassword = isValidPassword(password, user.password);

					if (!user || !validPassword) {
						return done(null, false);
					}
					return done(null, user);
				} catch (error) {
					return done("Incorrect credentials");
				}
			}
		)
	);


	passport.serializeUser((user, done) => {
		done(null, user._id);
	});
	passport.deserializeUser(async (id, done) => {
		if (id == 1)
			return done(null, {
				first_name: `Admin Coder`,
				email: "adminCoder@coder.com",
				role: "admin"
			});
		const user = await usersModel.findById(id);
		done(null, user);
	});
};

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies["coderCookieToken"];
	}
	return token;
};

export const passportCall = (strategy) => (req, res, next) => {
	if (strategy === passportStrategiesEnum.JWT) {
		passport.authenticate(
			strategy,
			{ session: false },
			function (err, user, info) {
				if (err) return next(err);
				if (!user) {
					req.logger.debug(`${info.messages ? info.messages : info.toString()}`)
					return res.status(401).send({
						status: "error",
						messages: info.messages ? info.messages : info.toString()
					});
				}
				req.user = user;

				next();
			}
		)(req, res, next);
	} else {
		next();
	}
};

export const passportCallViews = (strategy) => (req, res, next) => {
	if (strategy === passportStrategiesEnum.JWT) {

		passport.authenticate(
			strategy,
			{ session: false },
			function (err, user, info) {
				if (err) return next(err);
				if (!user) {
					req.logger.debug(`${info.messages ? info.messages : info.toString()}`)
					if(req.path === '/') return res.redirect("/login")
					return res.status(401).render("401",{
						status: "error",
						style: "401.css",
						messages: info.messages ? info.messages : info.toString()
					});
				}
				req.user = user;

				next();
			}
		)(req, res, next);
	} else {
		next();
	}
};