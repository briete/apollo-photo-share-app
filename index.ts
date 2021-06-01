import { ApolloServer } from 'apollo-server';
import {
    loadSchema,
    GraphQLFileLoader,
    addResolversToSchema,
} from 'graphql-tools';
import { resolvers } from './src/resolvers/resolver';

(async () => {
    const schema = await loadSchema('schema.graphql', {
        loaders: [new GraphQLFileLoader()],
    });

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

    const server = new ApolloServer({ schema: schemaWithResolvers });
    server
        .listen()
        .then(({ url }) => console.info(`GraphQL Service running on ${url}`));
})();
