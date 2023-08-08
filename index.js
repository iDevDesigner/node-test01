const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;
const uri = "mongodb://127.0.0.1:27017/";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  await client.connect();
  const db = client.db("sample_db");
  const cusCollection = db.collection("Customers");
  const empCollection = db.collection("Employees");
  return { empCollection, cusCollection };
}

app.get("/trips", (req, res) => {
  async function main() {
    const db = await connectToDatabase();
    // const collection = db.collection("Customers");
    // client.close(); -- To Validate error catch.
    // const customers = await collection.findOne({ CustomerID: 3 });
    const customers = await db.cusCollection.findOne({ CustomerID: 3 });
    const emplayees = await db.empCollection.findOne({ EmployeeID: 27 });
    console.log("Customer Data: ", customers);
    console.log("Employee Data: ", emplayees);
    res.send("Get Trips!");
  }
  main()
    .catch((err) => {
      console.error(err);
      res.send("404 Something wet wrong!");
    })
    .finally(() => {
      client.close();
    });
});
// app.get("/trips", (req, res) => res.send("Get Trip!"));

app.use(express.json());
app.post("/trip", (req, res) => {
  const body = req.body;
  console.log("Name : ", body);
  //   res.send("Post Trip!");

  async function main() {
    const db = await connectToDatabase();
    await db.cusCollection.insertOne(body);

    res.send("Post Trip!");
  }
  main()
    .catch((err) => {
      console.error(err);
      res.send("404 Something wet wrong!");
    })
    .finally(() => {
      client.close();
    });
});

app.get("/expenses", (req, res) => res.send("Get expenses!"));
app.post("/expense", (req, res) => res.send("Post expense!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
