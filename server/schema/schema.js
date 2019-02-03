const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];

// We need to rap the field inside a function because
// we don't execute the code till the whole code is read.
// In here we are defining how the graph should look like.
// This file is used to define
//1. define types 2. relationships between types 3. defining RootQueries
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        // GraphQLString is a special type of string.
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            // this type is the one we create and
            //this is the way to create relationships between them,
            //In here we also have the (parent) object
            //
            type: AuthorType,
            resolve(parent, args){
               // console.log(parent);
                // we need to find the author whose id
                //property matches the parent ( book )
                return _.find(authors, { id: parent.authorId });
            }
        }
    })
});
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            // This is a bit different than the books type and the reason for that
            //Is because we might have more than one book for the same author
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //This time we used filter and not find
                //because it will filter the correct books with the authorID that we specified
                return _.filter(books, { authorId: parent.id });
            }
        }
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
               // console.log(parent,args,books)
               // console.log(typeof(args.id))

                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return _.find(authors, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return authors;
            }
        }
    }
});

// we need to export this schema and pass the RootQuery that we defined
module.exports = new GraphQLSchema({
    query: RootQuery
});