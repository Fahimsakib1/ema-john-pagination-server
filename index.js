const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//dotenv file k require na korle env file ta kaj korbe na
require('dotenv').config();

//middle wares
app.use(cors());
app.use(express.json());


//username:emaJohnDB
//password: iaOlPJxAEuYZaX1I

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.axoxgat.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{

        const productCollection = client.db('emaJohn').collection('products'); 
        
        //database theke product er shob data k server er moddhe fetch korar code.. ==> CRUD er Read Operation
        app.get('/products', async(req, res) => {
            
            //client side theke page number and data sixe ta get korar jonno ei 2 line likha
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);

            const query = {};
            const cursor = productCollection.find(query);
            //client side theke page number and data size er hishebe server side er data load kora holo database theke
            const products = await cursor.skip(page*size).limit(size).toArray();
            
            //pagination er jonno kora ei code ta
            const count = await productCollection.estimatedDocumentCount();
            res.send({count, products});
        })

        
        //pagination er jonno client side e different different page er cart er moddhe add kora product gular shongkha different different dekhay.. ei jonno cart er moddhe product er ID diye shei product er data fetch kora holo
        app.post ('/productsByIds', async (req, res) => {
            const ids = req.body;
            console.log("IDs from server side.. IDs ekta ArrY Hobe", ids);

            const objectIds = ids.map(id => ObjectId(id))
            const query = {_id: {$in: objectIds}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })

    }

    finally{

    }
}
run().catch(error => console.log(error))



app.get('/', (req, res) => {
    res.send('Ema John Server is running')
})

app.listen(port, () => {
    console.log('Server is running at port', port)
})