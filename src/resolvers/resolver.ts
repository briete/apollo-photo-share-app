import { Resolvers } from '../types/generate';

const photos = [];

export const resolvers: Resolvers = {
    Query: {
        totalPhotos: (): number => photos.length,
    },
    Mutation: {
        postPhoto: (parent, args) => {
            photos.push(args);
            return true;
        },
    },
};
