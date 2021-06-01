import { Resolvers, Photo } from '../types/generate';

const photos: Array<Photo> = [];
let id = 0;

export const resolvers: Resolvers = {
    Query: {
        totalPhotos: (): number => photos.length,
        allPhotos: (): Array<Photo> => photos,
    },
    Mutation: {
        postPhoto: (parent, args): Photo => {
            const newPhoto: Photo = {
                id: (id++).toString(),
                ...args.input,
                url: '',
            };

            photos.push(newPhoto);

            return newPhoto;
        },
    },
    Photo: {
        url: (parent) => `http://youtesite.com/img/${parent.id}.jpg`,
    },
};
