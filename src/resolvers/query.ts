import { QueryResolvers } from '../types/generate';
import { ContextType } from './resolver';

export const query: QueryResolvers<ContextType> = {
    me: async (parent, args, { currentUser }) => currentUser,
    totalPhotos: async (parent, args, { db }) =>
        await db.collection('photos').estimatedDocumentCount(),
    allPhotos: async (parent, args, { db }) =>
        await db.collection('photos').find().toArray(),
    totalUsers: async (parent, args, { db }) =>
        await db.collection('users').estimatedDocumentCount(),
    allUsers: async (parent, args, { db }) =>
        await db.collection('users').find().toArray(),
};
