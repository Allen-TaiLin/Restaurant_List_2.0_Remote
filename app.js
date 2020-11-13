// require packages used in the projects
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const RestaurantData = require('./models/restaurant.js') // 載入 restaurant model
const app = express()
const port = 3000

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})



// routes setting
app.get('/', (req, res) => {
  RestaurantData.find()  // 取出 restaurant model 裡的所有資料
    .lean()  // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then((restaurants) => res.render('index', { restaurants: restaurants }))  // 將資料傳給 index 樣板
    .catch((error) => console.log(error))  // 錯誤處理
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  let restaurantList = []
  RestaurantData.find()
    .lean()
    .then((restaurants) => {
      restaurantList = restaurants.filter((item) => {
        console.log(item.name)
        return (item.name.toLowerCase().trim().includes(keyword.toLowerCase().trim())) || (item.category.toLowerCase().trim().includes(keyword.toLowerCase().trim()))
      })

      return res.render('index', { restaurants: restaurantList, keyword: keyword })
    })
    .catch((error) => console.log(error))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants/new', (req, res) => {
  // 從 req.body 拿出表單裡的資料
  const options = req.body
  //建立實例模型
  const restaurantAddNew = new RestaurantData({
    name: options.name,
    category: options.category,
    image: options.image,
    location: options.location,
    phone: options.phone,
    google_map: options.google_map,
    rating: options.rating,
    description: options.description
  })
  //將實例存入資料庫
  return restaurantAddNew.save()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

app.get('/restaurant/:id/detail', (req, res) => {
  const id = req.params.id
  return RestaurantData.findById(id)  //從資料庫找出資料
    .lean()  //把資料轉成javascript物件
    .then((restaurant) => res.render('detail', { restaurant: restaurant }))  //發送至前端樣板
    .catch((error) => console.log(error))  //例外處理
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})