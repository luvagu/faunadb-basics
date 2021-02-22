const express = require('express')

const app = express()

const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: FAUNA_KEY })

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
    Join
} = faunadb.query


app.get('/tweet/:id', (req, res) => {

})

app.listen(5000, () => console.log(`App listening on http://localhost:5000`))