const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const morgan = require('morgan')
const mongoose = require('mongoose');

(async function () {
    try {
        mongoose.connect('mongodb://khaledkzy:emp123@ds241664.mlab.com:41664/gql-khaled', { useNewUrlParser: true })
    } catch (e) {
        console.error(e)
    }
})()

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});
const app = express();
app.use(morgan('combined'))

// bind express with graphql
// it will allow us to use graphiql when we hit that address
app.use('/graphql', graphqlHTTP({
    // pass in a schema property
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});