import { DateTime } from "luxon"
import { Users as UsersDao } from "../dao/factory.js"
import UsersRepository from "../repositories/users.repository.js"
import { RequiredDocumentsNotFound, UserNotFoundError } from "../utils/custom.exceptions.js"



const usersDao = new UsersDao()
const userRepository = new UsersRepository(usersDao)

const requiredDocuments = [
	"identificacion",
	"domicilio",
	"cuenta"
]

export const getAllUsers = async () => {
	const users = await userRepository.getAllUsers()
	return users
}

export const getAllPrivateUsers = async () => {
	const users = await userRepository.getAllPrivateUsers()
	return users
}

export const changeRoleUser = async (uid) => {
	let result

	const user = await userRepository.getById(uid)
	if (!user) throw new UserNotFoundError("User not found, incorrect id")

	if (user.role === "user") {
		if (
			!requiredDocuments.every(document =>
				user?.documents?.some(userDocument => userDocument.name === document))
		) {
			throw new RequiredDocumentsNotFound(
				"No se tienen todos los documentos necesarios para cambiar a premium"
			)
		}
		result = await userRepository.changeRole(uid, "premium")
	} else if (user.role === "premium") {
		result = await userRepository.changeRole(uid, "user")
	}

	return result
}

export const getUserById = async (uid) => {
	const user = await userRepository.getById(uid)
	if (!user) throw new UserNotFoundError("User not found, incorrect id")
	return user
}

export const uploadDocuments = async (user, files) => {
	let documents = []
	const fileArray = Object.entries(files)
	fileArray.map(([name, data]) => {
		documents.push({ name, reference: data[0].path })
	})
	const result = await userRepository.uploadDocuments(user, documents)
	return result
}

export const deleteInactiveUsers = async () => {
	const users = await userRepository.getAllUsers()
	const inactiveUsers = users.filter((user) => {
		if(user.last_connection){
			const lastConnection = DateTime.fromFormat(user.last_connection, "dd/LL/yyyy, TT")
			const now = DateTime.now()
			return now.diff(lastConnection, "days").days.toFixed(0) <= 2
		}
	})
	const result = await userRepository.deleteInactiveUsers(inactiveUsers)
	return result
}

export const deleteOneUser = async (uid) => {
	const deletedUser = await userRepository.deleteOneUser(uid)
	return deletedUser
}