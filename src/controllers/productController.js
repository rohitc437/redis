const express = require("express")
const router = express.Router()
const Product = require("../models/productModel")
const client = require("../configs/redis")

router.post("", async (req, res) => {
    const product = await Product.create(req.body);

    client.set(`products.${product._id}`,JSON.stringify(product))

    const products = await Product.find().lean().exec();

    client.set("all_products",JSON.stringify(products))

    return res.status(201).send(product);
})

router.get("/setallkeys", async (req, res) => {

    const products = await Product.find().lean().exec();

    for(let i=0;i<products.length;i++){

        client.get(`products.${products[i]._id}`, function(err,pro){

            if(err) console.log(err)
    
            if(!pro) client.set(`products.${products[i]._id}`,JSON.stringify(products[i]))
    
        })
    }

    return res.status(201).send("done");
})

router.get("",(req, res) => {

    const page = +req.query.page || 1;
    const size = +req.query.size || 10;
    
    client.get(`all_products.${page}.${size}`, async function(err,pro){

        if(err) console.log(err)

        if(pro) return res.status(200).send(JSON.parse(pro))

        const offset = (page-1)*size;

        const products = await Product.find().skip(offset).limit(size).lean().exec();

        client.set(`all_products.${page}.${size}`,JSON.stringify(products))

        return res.status(201).send(products)

    })
})

router.get("/:id", (req, res) => {

    client.get(`products.${req.params.id}`, async function(err,pro){

        if(err) console.log(err)

        return res.status(200).send(JSON.parse(pro))

    })

})

router.patch("/:id", async (req, res) => {

    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});

    client.set(`products.${req.params.id}`,JSON.stringify(product))

    const products = await Product.find().lean().exec();
    
    client.set("all_products",JSON.stringify(products))

    return res.status(201).send(product);
})

router.delete("/:id", async (req, res) => {

    const product = await Product.findByIdAndDelete(req.params.id).lean().exec();

    client.del(`products.${req.params.id}`);

    const products = await Product.find().lean().exec();
    
    client.set("all_products",JSON.stringify(products))

    return res.status(201).send(product);
})


module.exports = router;