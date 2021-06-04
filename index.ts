import { Db, MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import expressPlayGround from 'graphql-playground-middleware-express';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import {
    loadSchema,
    GraphQLFileLoader,
    addResolversToSchema,
} from 'graphql-tools';
import { resolvers } from './src/resolvers/resolver';
import { User } from './src/types/generate';

dotenv.config();

const MongoDB = process.env.DB_HOST!;

async function start() {
    const app = express();
    const client = await MongoClient.connect(MongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db();

    const schema = await loadSchema('schema.graphql', {
        loaders: [new GraphQLFileLoader()],
    });

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

    const server = new ApolloServer({
        schema: schemaWithResolvers,
        context: async ({ req }): Promise<{ currentUser: User; db: Db }> => {
            const githubToken = req.headers.authorization;
            const currentUser = await db
                .collection('users')
                .findOne({ githubToken });
            return { currentUser, db };
        },
    });

    server.applyMiddleware({ app });

    app.get('/', (req, res) => res.end(`Welcome to the PhotoShare API`));
    app.get('/playground', expressPlayGround({ endpoint: '/graphql' }));

    app.listen({ port: 4000 }, () => {
        console.log(
            `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`,
        );
    });
}

start().catch((e) => console.error(e));
