//載入套件
const mongoose = require('mongoose')
// 載入 restaurant model
const RestaurantData = require('../restaurant')

//連線字串
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
//連線狀態
const db = mongoose.connection

//範本資料
const restaurantList = require('../../restaurant.json').results

//監聽error事件
db.on('error', () => {
  console.log('mongodb error')
})

//新增種子資料
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < restaurantList.length; i++) {
    RestaurantData.create({
      name: restaurantList[i].name,
      name_en: restaurantList[i].name_en,
      category: restaurantList[i].category,
      image: restaurantList[i].image,
      location: restaurantList[i].location,
      phone: restaurantList[i].phone,
      google_map: restaurantList[i].google_map,
      rating: restaurantList[i].rating,
      description: restaurantList[i].description
    })
  }
  console.log('done')
})