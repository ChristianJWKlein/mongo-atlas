//API Express
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

app.listen(3000, () => {
  console.log("listening on 3000");
});

const mongodb = require("mongodb"); //importing code from the node modules to the left (other developers code for mongodb)
const client = new mongodb.MongoClient(process.env.MONGO_URL);

const connectClient = async () => {
  await client.connect();
  console.log("Client Connected!");
};

connectClient().then();

const getUserCollection = () => {
  const db = client.db("christians-ecom-db");
  const col = db.collection("users");
  return col;
};

// const getProductCollection = () => {
//   const db = client.db("christians-ecom-db");
//   const col = db.collection("products");
//   return col;
// };

const getUsers = async () => {
  const col = getUserCollection();
  const users = await col.find({}).toArray();
  return users;
};

app.get("/users", (req, res) => {
  getUsers().then((users) => res.send(users));
});

app.post("/insertuser", async (req, res) => {
  const user = req.body;
  if (!user.name || !user.address) {
    res.send("Name or address not entered");
    return; //IF RETURN NOT THERE YOU DOnt prevent from happeniing
  }
  await insertUser(user);
  res.send(`succesfully inserted user: ${JSON.stringify(user)}`); //let
});

const insertUser = async (user) => {
  const col = getUserCollection();
  await col.insertOne(user);
  console.log("User Inserted by user!");
};

// const insertProduct = async () => {
//   const col = getProductCollection(product);
//   await col.insertOne({
//     product
//   });
//   console.log("Product added!");
// };

// const getProducts = async () => {
//   //this function gets the users in the user collection
//   const col = getProductCollection();
//   const products = await col.find({}).toArray(); //.find accepts a query this is asking for everything in the collection. then have to call .toArray bc it executes the query which is a promise. .find doesnt return a promise
//   return products;
// };
