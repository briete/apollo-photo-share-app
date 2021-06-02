import { Resolvers, Photo, User, AuthPayload } from '../types/generate';
import { GraphQLScalarType } from 'graphql';
import { Db } from 'mongodb';
import { authorizeGitHub } from '../lib/github-helper';
import * as dotenv from 'dotenv';

dotenv.config();

const ClientId = process.env.CLIENT_ID!;
const ClientSecret = process.env.CLIENT_SECRET!;

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
    Mutation: {
        githubAuth: async (parent, args, { db }): Promise<AuthPayload> => {
            try {
                const { message, access_token, avatar_url, login, name } =
                    await authorizeGitHub({
                        client_id: ClientId,
                        client_secret: ClientSecret,
                        code: args.code,
                    });

                // messageがある場合は、なんらかのエラーが発生している
                if (message) {
                    throw new Error(message);
                }

                const latestUserInfo: User = {
                    name,
                    githubLogin: login,
                    githubToken: access_token,
                    avatar: avatar_url,
                    postedPhotos: [],
                };

                const {
                    ops: [user],
                } = await db
                    .collection<User>('users')
                    .replaceOne({ githubLogin: login }, latestUserInfo, {
                        upsert: true,
                    });

                return { user, token: access_token };
            } catch (e) {
                console.error(e);
                throw new Error(e);
            }
        },
    },
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
