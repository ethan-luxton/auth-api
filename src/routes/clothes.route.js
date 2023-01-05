const express = require('express')

const { clothesCollection } = require('../models/index')
const { ensureRole, checkToken } = require('../auth/routes')

const clothesRoutes = express()

clothesRoutes.use(checkToken)

const getClothes = async (_, res) => {
    const allClothes = await clothesCollection.read()
    res.json(allClothes)
}

const getItem = async (req, res, next) => {
    const id = req.params.id
    const clothes = await clothesCollection.read(id)
    clothes === null ? next() : res.json(clothes)
}

const deleteClothes = async (req, res, next) => {
    const id = req.params.id
    const clothes = await clothesCollection.delete(id)
    if (clothes === null) {
        next()
    } else {
        await clothes
        res.json({})
    }
}

const createClothes = async (req, res) => {
    const itemName = req.body.name
    const group = req.body.group
    const clothes = await clothesCollection.create({
        name: itemName,
        group: group,
    })
    res.json(clothes)
}

const updateClothes = async (req, res, next) => {
    const id = req.params.id
    let clothes

    const itemName = req.body.name ?? clothes.name
    const group = req.body.group ?? user.group
    console.log(req.body.group)
    let updatedClothes = {
        name: itemName,
        group: group,
    }

    clothes = await clothesCollection.update(updatedClothes, id)
    res.json(clothes)
}

clothesRoutes.get(
    '/clothes',
    ensureRole(['reader', 'writer', 'editor', 'admin']),
    getClothes
) // Retrieve All
clothesRoutes.get(
    '/clothes/:id',
    ensureRole(['reader', 'writer', 'editor', 'admin']),
    getItem
) // Retrieve One
clothesRoutes.post(
    '/clothes',
    ensureRole(['writer', 'editor', 'admin']),
    createClothes
) // Create
clothesRoutes.put(
    '/clothes/:id',
    ensureRole(['editor', 'admin']),
    updateClothes
) // Update
clothesRoutes.delete('/clothes/:id', ensureRole(['admin']), deleteClothes) // Delete

module.exports = {
    clothesRoutes,
}
