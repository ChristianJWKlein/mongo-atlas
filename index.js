const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

app.listen(3000, () => {
  console.log("listening on 3000");
});

const mongodb = require("mongodb");
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

const getProductCollection = () => {
  const db = client.db("christians-ecom-db");
  const col = db.collection("products");
  return col;
};

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
    return; //IF RETURN NOT THERE YOU DON'T PREVENT UNFORMATTED INFO from entering DB
  }
  await insertUser(user);
  res.send(`succesfully inserted user: ${JSON.stringify(user)}`);
});

app.get("/products", async (res, req) => {
  getProducts().then((products) => res.send(products));
});

app.post("/insertproduct", async (res, req) => {
  const product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.product ||
    !product.price
  ) {
    res.send("Missing title, description, product, and/or price ");
    return;
  }
  await insertProduct(product);
  res.send(`succesfully inserted product: ${JSON.stringify(product)}`);
});

const insertUser = async (user) => {
  const col = getUserCollection();
  await col.insertOne(user);
  console.log("User Inserted by user!");
};

const insertProduct = async () => {
  const col = getProductCollection(product);
  await col.insertOne({
    product,
  });
  console.log("Product added!");
};

const getProducts = async () => {
  const col = getProductCollection();
  const products = await col.find({}).toArray();
  return products;
};
