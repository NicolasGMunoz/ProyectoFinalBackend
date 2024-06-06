import { Router as expressRotuer } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import passport from "passport";

export default class Router {
	constructor() {
		this.rotuer = expressRotuer();
		this.init();
	}

	getRouter() {
		return this.rotuer;
	}
	init() {}

	get(path, policies, strategy, ...callbacks) {
		this.rotuer.get(
			path,
			this.applyCustomPassportCall(strategy),
			this.handlePolicies(policies),
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	post(path, policies, strategy, ...callbacks) {
		this.rotuer.post(
			path,
			this.applyCustomPassportCall(strategy),
			this.handlePolicies(policies),
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	put(path, policies, strategy, ...callbacks) {
		this.rotuer.put(
			path,
			this.applyCustomPassportCall(strategy),
			this.handlePolicies(policies),
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	delete(path, policies, strategy, ...callbacks) {
		this.rotuer.delete(
			path,
			this.applyCustomPassportCall(strategy),
			this.handlePolicies(policies),
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}

	generateCustomResponse = (req, res, next) => {
		res.sendSuccess = (data) => {
			return res.status(200).json({ status: "success", payload: data });
		};
		res.sendSuccessNewResource = (data) => {
			return res.status(201).json({ status: "success", ...data });
		};
		res.sendClientError = (error) => {
			return res.status(400).json({ status: "error", message: error });
		};
		res.sendAuthError = (error) => {
			return res.status(401).json({ status: "error", message: error });
		};
		res.sendPermissionsError = (error) => {
			return res.status(403).json({ status: "error", message: error });
		};
    res.sendNotFoundError = (error) => {
      return res.status(404).json({ status: "error", message: error });
    }
    res.sendUnproccesableEntity = (error) => {
      return res.status(422).json({ status: "error", message: error })
    }
		res.sendServerError = (error) => {
			return res.status(500).json({ status: "error", message: error });
		};
		next();
	};

	applyCustomPassportCall = (strategy) => (req, res, next) => {
		if (strategy === passportStrategiesEnum.JWT) {
			passport.authenticate(strategy,{ session: false }, function (err, user, info) {
				if (err) return next(err);
				if (!user)
					return res
						.status(401)
						.send({
							status: "error",
							messages: info.messages ? info.messages : info.toString()
						});
				req.user = user;
				
				next();
			})(req, res, next);
		} else {
			next();
		}
	};

	handlePolicies = (policies) => (req, res, next) => {
		if (policies[0] === accessRolesEnum.PUBLIC) return next();
		const user = req.user;
		if (!policies.includes(user?.role.toLowerCase()))
			return res
				.status(403)
				.json({ status: "error", message: "not permissions" });

		next();
	};

	applyCallbacks(callbacks) {
		return callbacks.map((callback) => async (...params) => {
			try {
				await callback.apply(this, params);
			} catch (error) {
				params[1].status(500).json({ status: "error", message: error.message });
			}
		});
	}
}
