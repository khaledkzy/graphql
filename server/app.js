const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
var morgan = require('morgan')
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