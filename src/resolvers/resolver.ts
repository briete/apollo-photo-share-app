import { Resolvers, Photo, User, PhotoCategory } from '../types/generate';
import { GraphQLScalarType } from 'graphql';
import { Db } from 'mongodb';

export const resolvers: Resolvers<{ db: Db }> = {
    Query: {
        totalPhotos: async (parent, args, { db }): Promise<number> =>
            await db.collection('photos').estimatedDocumentCount(),
        allPhotos: async (parent, args, { db }): Promise<Array<Photo>> =>
            await db.collection('photos').find().toArray(),
        totalUsers: async (parent, args, { db }): Promise<number> =>
            await db.collection('users').estimatedDocumentCount(),
        allUsers: async (parent, args, { db }): Promise<Array<User>> =>
            await db.collection('users').find().toArray(),
    },
    Mutation: {},
    Photo: {
        url: (parent) => `http://youtesite.com/img/${parent.id}.jpg`,
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value.',
        parseValue: (value) => new Date(value),
        serialize: (value) => new Date(value).toISOString(),
        parseLiteral: (ast) => ast.kind,
    }),
};
