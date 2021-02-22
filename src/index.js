require('dotenv').config()

const express = require('express')
const { Ref } = require('faunadb')

const app = express()

const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNA_KEY })

const { 
    Paginate,
    Get,
    Select,
    Match,
    Index,
    Create,
    Collection,
    Lambda,
    Var,
    Join,
    Call,
    Function: Fn
} = faunadb.query


app.get('/tweet/:id', async (req, res) => {
    try {
        const doc = await client.query(
            Get(
                Ref(
                    Collection('tweets'),
                    req.params.id
                )
            )
        )
    
        res.send(doc)
    } catch (error) {
        console.log(error)
        res.status(404).send({ message: 'Could not get tweet' })
    }
})

app.get('/tweet', async (req, res) => {
    try {
        const doc = await client.query(
            Paginate(
                Match(
                    Index('tweets_by_user'),
                    Call(Fn('getUser'), 'luis@example.com')
                )
            )
        )
    
        res.send(doc)
    } catch (error) {
        console.log(error)
        res.status(404).send({ message: 'Could not get tweet' })
    }
})

app.post('/tweet', async (req, res) => {
    try {
        const data = {
            user: Call(Fn('getUser'), 'luis@example.com'),
            text: 'My tweet 524'
        }

        const doc = await client.query(
            Create(
                Collection('tweets'),
                { data }
            )
        )
    
        res.send(doc)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Could not create tweet' })
    }
})

app.post('/relationship', async (req, res) => {
    try {
        const data = {
            follower: Call(Fn('getUser'), 'carlos@example.com'),
            followee: Call(Fn('getUser'), 'luis@example.com')
        }

        const doc = await client.query(
            Create(
                Collection('relationships'),
                { data }
            )
        )

        res.send(doc)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Could not create relationship' })
    }
})

app.get('/feed', async (req, res) => {
    try {
        const docs = await client.query(
            Paginate(
                Join(
                    Match(
                        Index('followees_by_follower'),
                        Call(Fn('getUser'), 'carlos@example.com')
                    ),
                    Index('tweets_by_user')
                )
            )
        )
    
        res.send(docs)
    } catch (error) {
        console.log(error)
        res.status(404).send({ message: 'Could not get tweet' })
    }
})

app.listen(5000, () => console.log(`App listening on http://localhost:5000`))