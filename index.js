import { MongoClient, ServerApiVersion } from 'mongodb';
import express from "express"
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const databaseUrl = process.env.CONNECTION_URL;
const app = express()
const port = 3000

const client = new MongoClient(databaseUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.post('/add-user', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  insertUser(name, email, password).
    then(res.send({ userAdded: true }));
});


app.get('/login', (req, res) => {
  fetchLogin().then(login => {
    res.json(login);
  });
})

app.get('/support', (req, res) => {
  fetchQuestion().then(question => {
    res.json(question);
  });
})

app.post('/add-render-prijs', (req, res) => {
  const prijs = req.body.prijs;
  const tijd = req.body.tijd;
  insertRenderPrijs(prijs, tijd).
  then(res.send({ addPrijs: true }));
});

app.get('/render-prijs-uur', (req, res) => {
  renderUurPrijs().then(documents => {
    res.json(documents);
  });
});

app.get('/render-prijs-week', (req, res) => {
  renderWeekPrijs().then(documents => {
    res.json(documents);
  });
});

app.get('/render-prijs-jaar', (req, res) => {
  renderJaarPrijs().then(documents => {
    res.json(documents);
  });
});

app.post('/add-bitcoin-prijs', (req, res) => {
  const prijs = req.body.prijs;
  const tijd = req.body.tijd;
  insertBitcoinPrijs(prijs, tijd)
  .then(() => res.send({ addPrijs: true }))
  .catch(err => {
    console.error(err);
    res.status(500).send({ addPrijs: false });
  });
});

app.get('/bitcoin-prijs', (req, res) => {
  fetchBitcoinDocuments()
  .then(documents => res.json(documents))
  .catch(err => {
    console.error(err);
    res.status(500).send({ error: 'Failed to fetch documents' });
  });
});

app.post('/add-render-prijs', (req, res) => {
  const prijs = req.body.prijs;
  const tijd = req.body.tijd;
  insertRenderPrijs(prijs, tijd).
  then(res.send({ addPrijs: true }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function insertUser(name, email, password) {
  try {
    await client.connect();
    const database = client.db("dashboardMinder");
    const collection = database.collection("users");
    await collection.insertOne({ name: name, email: email, password: password });
    console.log("succesfully inserted user");
  } finally {
    await client.close();
  }
}

async function fetchLogin() {
  try {
    await client.connect();
    const database = client.db("dashboardMinder");
    const collection = database.collection('users');
    const login = await collection.find().toArray();
    return login;
  } finally {
    await client.close();
  }
}

async function fetchQuestion() {
  try {
    await client.connect();
    const database = client.db("dashboardMinder");
    const collection = database.collection('support');
    const question = await collection.find().toArray();
    return question;
  } finally {
    await client.close();
  }
}

async function insertRenderPrijs(prijs, tijd) {
  try {
    await client.connect();
    const database = client.db("renderPrijs");
    const collection = database.collection("uur");

    // Voeg het nieuwe object toe aan de collectie
    await collection.insertOne({ prijs: prijs, tijd: tijd });
    console.log("Succesvol ingevoegd");

    const oldestDocument = await collection.find().sort({ _id: 1 }).limit(1).next();

    if (oldestDocument) {
      await collection.deleteOne({ _id: oldestDocument._id });
      console.log("Oudste object verwijderd");
    } else {
      console.log("Geen objecten om te verwijderen");
    }

  } finally {
    await client.close();
  }
};

async function renderUurPrijs() {
    try {
        await client.connect();
        const database = client.db('renderPrijs');
        const collection = database.collection('uur');
        const documents = await collection.find().toArray();
        return documents;
    } finally {
        await client.close();
    }
}

async function renderWeekPrijs() {
  try {
      await client.connect();
      const database = client.db('renderPrijs');
      const collection = database.collection('week');
      const documents = await collection.find().toArray();
      return documents;
  } finally {
      await client.close();
  }
}

async function renderJaarPrijs() {
  try {
      await client.connect();
      const database = client.db('renderPrijs');
      const collection = database.collection('jaar');
      const documents = await collection.find().toArray();
      return documents;
  } finally {
      await client.close();
  }
}


async function insertBitcoinPrijs(prijs, tijd) {
  try {
    await client.connect();
    const database = client.db("bitcoin");
    const collection = database.collection("uur");

    // Voeg het nieuwe object toe aan de collectie
    await collection.insertOne({ prijs: prijs, tijd: tijd });
    console.log("Succesvol ingevoegd");

    const oldestDocument = await collection.find().sort({ _id: 1 }).limit(1).next();

    if (oldestDocument) {
      await collection.deleteOne({ _id: oldestDocument._id });
      console.log("Oudste object verwijderd");
    } else {
      console.log("Geen objecten om te verwijderen");
    }

  } finally {
    await client.close();
  }
}

async function fetchBitcoinDocuments() {
  try {
    await client.connect();
    const database = client.db('bitcoin');
    const collection = database.collection('uur');
    const documents = await collection.find().toArray();
    return documents;
  } finally {
    await client.close();
  }
}




