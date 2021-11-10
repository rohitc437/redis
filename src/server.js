const express = require("express")
const app = require("./index")
app.use(express.json())
const connect = require("./configs/db")

const productController = require("./controllers/productController")

app.use(express.urlencoded({ extended: true })); 

app.use("/products",productController)

app.listen(2365, async function () {

    await connect();
    console.log("listening on port 2365")
})


