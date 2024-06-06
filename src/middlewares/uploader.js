import multer from "multer"
import { __dirname } from "../utils.js"
import { logger } from "../utils/logger.js"

let folder = `${__dirname}/public/assets`

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		switch (file.fieldname) {
			case "perfil":
				cb(null, `${folder}/profiles`)
				break
			case "productos":
				cb(null, `${folder}/products`)
				break
			case "identificacion":
				cb(null, `${folder}/documents`)
				break
			case "domicilio":
				cb(null, `${folder}/documents`)
				break
			case "cuenta":
				cb(null, `${folder}/documents`)
				break
			default:
				break
		}
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)

	}
})

const uploader = multer({ storage })

export default uploader