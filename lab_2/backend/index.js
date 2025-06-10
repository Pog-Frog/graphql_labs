const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const cors = require('cors');

const typeDefs = `
  type Car {
    id: ID!
    name: String!
    model: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    cars: [Car!]!
  }

  type Query {
    cars: [Car!]!
    car(id: ID!): Car
    users: [User!]!
    user(id: ID!): User
    hello: String!
  }

  type Mutation {
    addCar(name: String!, model: String!): Car!
    addUser(name: String!, email: String!, age: Int): User!
    updateCar(id: ID!, name: String, model: String): Car
    deleteCar(id: ID!): Boolean!
  }
`;

let cars = [
  {
    id: '1',
    name: 'Toyota',
    model: 'Corolla'
  },
  {
    id: '2',
    name: 'Honda',
    model: 'Civic'
  },
  {
    id: '3',
    name: 'Ford',
    model: 'Focus'
  }
];

let users = [
  {
    id: '1',
    name: 'Big boy',
    email: 'BigD@gmail.com',
    age: 3
  },
  {
    id: '2',
    name: 'Big girl',
    email: 'BigP@gmail.com',
    age: 2
  }
];

const resolvers = {
  Query: {
    cars: () => cars,
    car: (_, { id }) => cars.find(car => car.id === id),
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
    hello: () => 'Hello from GraphQL API!'
  },
  Mutation: {
    addCar: (_, { name, model }) => {
      const newCar = {
        id: String(cars.length + 1),
        name,
        model
      };
      cars.push(newCar);
      return newCar;
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
    updateCar: (_, { id, name, model }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) return null;

      const updatedCar = {
        ...cars[carIndex],
        ...(name && { name }),
        ...(model && { model })
      };

      cars[carIndex] = updatedCar;
      return updatedCar;
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) return false;

      cars.splice(carIndex, 1);
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
