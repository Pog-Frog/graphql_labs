# GraphQL API with Express

A basic GraphQL API built with Express.js and Apollo Server.

## Features

- 🚀 GraphQL API with Apollo Server
- 📚 Book management (CRUD operations)
- 👥 User management
- 🔍 Query and Mutation support
- 📊 GraphQL Playground for testing
- 🏥 Health check endpoint

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

1. Start the development server:
```bash
pnpm dev
```

1. Start the production server:
```bash
pnpm start
```

The server will be running at `http://localhost:4000`

## API Endpoints

- **GraphQL Playground**: `http://localhost:4000/graphql`
- **Health Check**: `http://localhost:4000/health`
- **Root**: `http://localhost:4000/`

## GraphQL Schema

### Types

#### Book
```graphql
type Book {
  id: ID!
  title: String!
  author: String!
  publishedYear: Int
  genre: String
}
```

#### User
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}
```

### Queries

```graphql
# Get all books
query GetBooks {
  books {
    id
    title
    author
    publishedYear
    genre
  }
}

# Get a specific book
query GetBook($id: ID!) {
  book(id: $id) {
    id
    title
    author
    publishedYear
    genre
  }
}

# Get all users
query GetUsers {
  users {
    id
    name
    email
    age
  }
}

# Get a specific user
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    age
  }
}

# Simple hello query
query Hello {
  hello
}
```

### Mutations

```graphql
# Add a new book
mutation AddBook($title: String!, $author: String!, $publishedYear: Int, $genre: String) {
  addBook(title: $title, author: $author, publishedYear: $publishedYear, genre: $genre) {
    id
    title
    author
    publishedYear
    genre
  }
}

# Add a new user
mutation AddUser($name: String!, $email: String!, $age: Int) {
  addUser(name: $name, email: $email, age: $age) {
    id
    name
    email
    age
  }
}

# Update a book
mutation UpdateBook($id: ID!, $title: String, $author: String, $publishedYear: Int, $genre: String) {
  updateBook(id: $id, title: $title, author: $author, publishedYear: $publishedYear, genre: $genre) {
    id
    title
    author
    publishedYear
    genre
  }
}

# Delete a book
mutation DeleteBook($id: ID!) {
  deleteBook(id: $id)
}
```

## Example Usage

### Using GraphQL Playground

1. Go to `http://localhost:4000/graphql`
2. Try the following query:

```graphql
query {
  books {
    id
    title
    author
    publishedYear
  }
  hello
}
```

3. Try adding a new book:

```graphql
mutation {
  addBook(
    title: "The Catcher in the Rye"
    author: "J.D. Salinger"
    publishedYear: 1951
    genre: "Fiction"
  ) {
    id
    title
    author
  }
}
```

### Using curl

```bash
# Query books
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ books { id title author } }"}'

# Add a new book
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { addBook(title: \"New Book\", author: \"Author Name\") { id title author } }"}'
```

## Project Structure

```
backend_express/
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
└── README.md        # This file
```
