import { Resolvers, User } from '../types/generate';
import { query } from './query';
import { mutation } from './mutation';
import { Database } from '../infrastructures/database/posgresql';

export type ContextType = { db: Database; currentUser: User };

export const resolvers: Resolvers<ContextType> = {
    Query: query,
    Mutation: mutation,
};
