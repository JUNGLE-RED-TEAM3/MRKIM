const mongoose = require("mongoose")

// mongoDB에 제시어를 저장할 스키마
const themeWord = new mongoose.Schema({
  theme : String,
  name : String,
});

// 제시어 모델정의
const FruitWord = mongoose.model('Fruit', themeWord)
module.exports = FruitWord