const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const cors = require('cors');

const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int
    genre: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    users: [User!]!
    user(id: ID!): User
    hello: String!
  }

  type Mutation {
    addBook(title: String!, author: String!, publishedYear: Int, genre: String): Book!
    addUser(name: String!, email: String!, age: Int): User!
    updateBook(id: ID!, title: String, author: String, publishedYear: Int, genre: String): Book
    deleteBook(id: ID!): Boolean!
  }
`;

let books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publishedYear: 1925,
    genre: 'Fiction'
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    publishedYear: 1949,
    genre: 'Dystopian Fiction'
  },
  {
    id: '3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publishedYear: 1960,
    genre: 'Fiction'
  }
];

let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25
  }
];

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(book => book.id === id),
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
    hello: () => 'Hello from GraphQL API!'
  },
  Mutation: {
    addBook: (_, { title, author, publishedYear, genre }) => {
      const newBook = {
        id: String(books.length + 1),
        title,
        author,
        publishedYear,
        genre
      };
      books.push(newBook);
      return newBook;
    },
    addUser: (_, { name, email, age }) => {
      const newUser = {
        id: String(users.length + 1),
        name,
        email,
        age
      };
      users.push(newUser);
      return newUser;
    },
    updateBook: (_, { id, title, author, publishedYear, genre }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) return null;
      
      const updatedBook = {
        ...books[bookIndex],
        ...(title && { title }),
        ...(author && { author }),
        ...(publishedYear && { publishedYear }),
        ...(genre && { genre })
      };
      
      books[bookIndex] = updatedBook;
      return updatedBook;
    },
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) return false;
      
      books.splice(bookIndex, 1);
      return true;
    }
  }
};

async function startServer() {
  const app = express();
  
  app.use(cors({
    origin: '*',
    credentials: true
  }));
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
  });

  await server.start();

  app.use('/graphql', 
    cors({
      origin: '*',
      credentials: true
    }),
    json(), 
    expressMiddleware(server, {
      context: async ({ req }) => ({ req })
    })
  );

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});
