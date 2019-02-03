const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/Author');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

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
            resolve(parent, args) {
                // console.log(parent);
                // we need to find the author whose id
                //property matches the parent ( book )
                // return _.find(authors, { id: parent.authorId });
                return Author.findById(parent.authorId)
            }
        }
    })
});
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            // This is a bit different than the books type and the reason for that
            //Is because we might have more than one book for the same author
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //This time we used filter and not find
                //because it will filter the correct books with the authorID that we specified
                //return _.filter(books, { authorId: parent.id });
                return Book.find({ authorId: parent.id });
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
                // return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                // We are using the model Author that we have created using mongose
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                // we can save the instance the we just created which is author
                // monogoose will do the heavy work of saving it online
                // we must return
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        deleteAuthor: {
            type: AuthorType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },

            },
            resolve(parent, args) {
                // We are using the model Author that we have created using mongose
                // we can save the instance the we just created which is author
                // monogoose will do the heavy work of saving it online
                // we must return
                console.log(args.id)
                return Author.deleteOne({ _id: args.id });
            }
        },
        updateAuthor: {
            type: AuthorType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                // We are using the model Author that we have created using mongose
                // we can save the instance the we just created which is author
                // monogoose will do the heavy work of saving it online
                // we must return
                console.log(args.id)
                return Author.findByIdAndUpdate(
                    args.id,
                   {name: args.name ,age:args.age}
                  )
            }
        },
    }
});

// we need to export this schema and pass the RootQuery that we defined
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});