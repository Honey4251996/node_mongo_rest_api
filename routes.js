const express = require('express')
const Joi = require('@hapi/joi')
const { insertItem, getItems, updateQuantity, deleteItem } = require('./db')

const router = express.Router()

const itemSchema = Joi.object().keys({
    name: Joi.string(),
    quantity: Joi.number().integer().min(0)
})

router.post('/item', (req, res) => {
    // We get the item from the request body
    const item = req.body

    // The itemSchema is used to validate the fields of the item
    const result = itemSchema.validate(item)
    if (result.error) {
        // if any of the fields are wrong, log the error and return a 400 status
        console.log(result.error)
        res.status(400).end()
        return
    }

    // If the validation passes, insert the item into the DB
    insertItem(item)
        .then(() => {
            // Once the item is inserted successfully, return a 200 OK status
            res.status(200).end()
        })
        .catch((err) => {
            // If there is any error in inserting the item, log the error and
            // return a 500 server error status
            console.log(err)
            res.status(500).end()
        })
})



router.get('/items', (req, res) => {
    // `getItems` returns a new promise which resolves with the result
    getItems()
        .then((items) => {
            // The promise resolves with the items as results
            items = items.map((item) => ({
                // In mongoDB, each object has an id stored in the `_id` field
                // here a new field called `id` is created for each item which 
                // maps to its mongo id
                id: item._id,
                name: item.name,
                quantity: item.quantity
            }))

            // Finally, the items are written to the response as JSON
            res.json(items)
        })
        .catch((err) => {
            // If there is an error in getting the items, we return a 500 status
            // code, and log the error
            console.log(err)
            res.status(500).end()
        })
})


router.put('/item/:id/quantity/:quantity', (req, res) => {
    // We can get the values from the `req.params` object
    const { id, quantity } = req.params

    // The updateQuantity function is called with the id and quantity increment
    updateQuantity(id, parseInt(quantity))
        .then(() => {
            // If the update is successful, return a 200 OK status
            res.status(200).end()
        })
        .catch((err) => {
            // If the update fails, return a 500 server error
            console.log(err)
            res.status(500).end()
        })
})

router.delete('/item/:id', (req, res) => {
    // We can get the values from the `req.params` object
    const { id } = req.params

    // The updateQuantity function is called with the id and quantity increment
    deleteItem(id)
        .then(() => {
            // If the update is successful, return a 200 OK status
            res.status(200).end()
        })
        .catch((err) => {
            // If the update fails, return a 500 server error
            console.log(err)
            res.status(500).end()
        })
})



module.exports = router