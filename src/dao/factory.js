import configs from "../config.js"


const persistence = configs.persistence


let Products, Carts, Users, Tickets
let tts

switch(persistence) {
  case 'MONGO':
    console.log("Trabajando con BD Mongo")
    const mongoose = await import('mongoose')
    const MongoStore = await import("connect-mongo")
    try {
      tts = await mongoose.connect(configs.mongoUrl)    
      const { default: ProductsMongo } = await import('./dbManagers/products.manager.js')
      const { default: CartsMongo } = await import('./dbManagers/carts.manager.js')
      const { default: UsersMongo } = await import('./dbManagers/users.manager.js')
      const { default: TicketsMongo } = await import('./dbManagers/tickets.manager.js')

      Products = ProductsMongo
      Carts = CartsMongo
      Users = UsersMongo
      Tickets = TicketsMongo
   
    } catch (error) {
      console.log(error.message)
      mongoose.disconnect()
    }
    break
  case 'FILE':
    console.log("Trabajando con archivos")
    const { default: CartsFile } = await import('./fileManger/managers/cartManager.js')
    const { default: ProductsFile } = await import('./fileManger/managers/productManager.js')
    Products = ProductsFile
    Carts = CartsFile
    break    
}

export {
  Products,
  Carts,
  Users,
  Tickets,
  tts
}