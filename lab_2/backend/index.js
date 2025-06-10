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
    driverId: ID
  }

  type Driver {
    id: ID!
    name: String!
    email: String!
    age: Int
    cars: [Car!]!
  }

  type Query {
    cars: [Car!]!
    car(id: ID!): Car
    drivers: [Driver!]!
    driver(id: ID!): Driver
    hello: String!
  }

  type Mutation {
    addCar(name: String!, model: String!, driverId: ID): Car!
    addDriver(name: String!, email: String!): Driver!
    updateCar(id: ID!, name: String, model: String, driverId: ID): Car
    deleteCar(id: ID!): Boolean!
  }
`;

let cars = [
  {
    id: '1',
    name: 'Toyota',
    model: 'Corolla',
    driverId: '1'
  },
  {
    id: '2',
    name: 'Honda',
    model: 'Civic',
    driverId: '1'
  },
  {
    id: '3',
    name: 'Ford',
    model: 'Focus',
    driverId: '2'
  }
];

let drivers = [
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
  },
  {
    id: '3',
    name: 'Omar',
    email: 'Omar@gmail.com',
    age: 20
  }
];

const resolvers = {
  Query: {
    cars: () => cars,
    car: (_, { id }) => cars.find(car => car.id === id),
    drivers: () => drivers,
    driver: (_, { id }) => drivers.find(driver => driver.id === id),
    hello: () => 'Hello from GraphQL API!'
  },
  Driver: {
    cars: (driver) => cars.filter(car => car.driverId === driver.id)
  },
  Mutation: {
    addCar: (_, { name, model, driverId }) => {
      const newCar = {
        id: String(cars.length + 1),
        name,
        model,
        driverId
      };
      cars.push(newCar);
      return newCar;
    },
    addDriver: (_, { name, email, age }) => {
      const newDriver = {
        id: String(drivers.length + 1),
        name,
        email,
        age
      };
      drivers.push(newDriver);
      return newDriver;
    },
    updateCar: (_, { id, name, model, driverId }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) return null;

      const updatedCar = {
        ...cars[carIndex],
        ...(name && { name }),
        ...(model && { model }),
        ...(driverId && { driverId })
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
