/* --------- MongoDB 저장 -----------
$node db.js
*/

const mongoose = require("mongoose")
const FruitWord = require("./models/fruits");

// --------------- MongoDB와 연결 -----------
// -------- 'express'라는 데이터베이스에 접근 ----
mongoose.connect("mongodb://127.0.0.1:27017/express", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
);

// ------- mongoose.connect() 연결 후 연결객체(mongoose.connection)를 db 변수에 저장
const db = mongoose.connection;
const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error)
db.once("open", handleOpen); //open 이벤트가 발생 시 handleOpen 실행 
db.on("error", handleError); //error 이벤트가 발생할 때마다 handleError 실행

const FruitWords = [
  {
    theme: '과일',
    name: '사과'
  },
  {
    theme: '과일',
    name: '수박'
  },
  {
    theme: '과일',
    name: '딸기'
  },
  {
    theme: '과일',
    name: '블루베리'
  },
  {
    theme: '과일',
    name: '천혜향'
  },
  {
    theme: '과일',
    name: '레몬'
  },
  {
    theme: '과일',
    name: '아보카도'
  }
];

const insertFruitWords = async () => {
  try {
    const result = await FruitWord.insertMany(FruitWords);
    console.log("성공했다!! 과일 DB 성공! 확인해보자!", result);
  } catch (error) {
    console.log(error);
  }
};

insertFruitWords();