import UsersDto from "../DTOs/users.dto.js"

export default class UsersRepository {
	constructor(dao) {
		this.dao = dao
	}

	getAllUsers = async () => {
		const users = await this.dao.getAll()
		const publicUsers = users.map((user) => {
			const userDto = new UsersDto(user)
			const publicUser = userDto.getPublicData() 
			return publicUser
		})
		return publicUsers
	}

	getAllPrivateUsers = async () => {
		const users = await this.dao.getAll()
		const publicUsers = users.map((user) => {
			const userDto = new UsersDto(user)
			const privateUser = userDto.getPrivateData()
			return privateUser 
		})
		return publicUsers
	}

	login = async (email) => {
		const user = await this.dao.getByEmail(email)
		if (user) this.dao.signInSignOut(email)
		return user
	}

	getByEmail = async (email) => {
		const user = await this.dao.getByEmail(email)
		return user
	}

	getById = async (uid) => {
		const user = await this.dao.getById(uid)
		return user
	}

	showPublicUser = async (user) => {
		const finalUser = new UsersDto(user).getPublicData()
		return finalUser
	}

	addCartToUser = async (user, cartId) => {
		const result = await this.dao.addCartToUser(user, cartId)
		return result
	}

	register = async (newUser) => {
		const result = await this.dao.create(newUser)
		return result
	}

	logout = async (email) => {
		const result = await this.dao.deleteCartFromUser(email)
		if (result) this.dao.signInSignOut(email)
		return result
	}

	updatePassword = async (email, password) => {
		const result = await this.dao.updatePassword(email, password)
		return result
	}

	changeRole = async (uid, role) => {
		const result = await this.dao.changeRole(uid, role)
		return result
	}

	uploadDocuments = async (user, documents) => {
		const result = await this.dao.uploadDocuments(user, documents)
		return result
	}

	deleteInactiveUsers = async (inactiveUsers) => {
		const result = await this.dao.deleteInactiveUsers(inactiveUsers)
		return result
	}

	deleteOneUser = async (uid) => {
		const result = await this.dao.deleteOneUser(uid)
		return result
	}
}