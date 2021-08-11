import { QueryResolvers } from '../types/generate';
import { ContextType } from './resolver';

export const query: QueryResolvers<ContextType> = {
    me: async (parent, args, { currentUser }) => currentUser,
    totalPhotos: async (parent, args, { db }) => await db.totalPhotos(),
    allPhotos: async (parent, args, { db }) => await db.allPhotos(),
    totalUsers: async (parent, args, { db }) => await db.totalUsers(),
    allUsers: async (parent, args, { db }) => await db.allUsers(),
};
