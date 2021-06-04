import { Resolvers, User } from '../types/generate';
import { GraphQLScalarType } from 'graphql';
import { Db } from 'mongodb';
import { query } from './query';
import { mutation } from './mutation';
import * as dotenv from 'dotenv';

dotenv.config();

export type ContextType = { db: Db; currentUser: User };

export const resolvers: Resolvers<ContextType> = {
    Query: query,
    Mutation: mutation,
    Photo: {
        url: (parent) => `/img/photos/${parent.id}.jpg`,
        postedBy: (parent, args, { db }) =>
            db.collection('users').findOne({ githubLogin: parent.userID }),
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value.',
        parseValue: (value) => new Date(value),
        serialize: (value) => new Date(value).toISOString(),
        parseLiteral: (ast) => ast.kind,
    }),
};
