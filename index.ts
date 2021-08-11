import * as dotenv from 'dotenv';
import expressPlayGround from 'graphql-playground-middleware-express';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import {
    loadSchema,
    GraphQLFileLoader,
    addResolversToSchema,
} from 'graphql-tools';
import { Database } from './src/infrastructures/database/posgresql';
import { resolvers } from './src/resolvers/resolver';
import { User } from './src/types/generate';

dotenv.config();

const DB_HOST = process.env.DB_HOST!;
const DB_DATABASE = process.env.DB_DATABASE!;
const DB_USER = process.env.DB_USER!;
const DB_PASSWORD = process.env.DB_PASSWORD!;

const knexConfig = {
    client: 'pg',
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    },
};

async function start() {
    const app = express();

    const db = new Database(knexConfig);

    const schema = await loadSchema('schema.graphql', {
        loaders: [new GraphQLFileLoader()],
    });

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

    const server = new ApolloServer({
        schema: schemaWithResolvers,
        dataSources: () => ({ db }),
        context: async ({
            req,
        }): Promise<{ currentUser: User; db: Database }> => {
            const githubToken = req.headers.authorization;
            const currentUser = await db.getUser(githubToken!);
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
