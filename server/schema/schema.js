const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID
} = graphql;

var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3' },
];

// We need to rap the field inside a function
// In here we are defining how the graph should look like.
// This file is used to define
//1. define types 2. relationships between types 3. defining RootQueries
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        // GraphQLString is a special type of string.
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
    })
});

// like getting a book / authors / all books / all authors
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // this name is very important because we will use it while quering later on.
        // So we will write books{gener author somethingelse}
        book: {
            type: BookType,
            //this will make the query look like book(id:'123'){}
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db / other source
                console.log(parent,args)
                console.log(typeof(args.id))

                return _.find(books, { id: args.id });
            }
        }
    }
});

// we need to export this schema and pass the RootQuery that we defined
module.exports = new GraphQLSchema({
    query: RootQuery
});