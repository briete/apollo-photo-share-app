import { authorizeGitHub } from '../lib/github-helper';
import { MutationResolvers, Photo, User } from '../types/generate';
import { ContextType } from './resolver';

const ClientId = process.env.CLIENT_ID!;
const ClientSecret = process.env.CLIENT_SECRET!;

const githubAuth: MutationResolvers<ContextType>['githubAuth'] = async (
    parent,
    args,
    { db },
) => {
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
};

const postPhoto: MutationResolvers<ContextType>['postPhoto'] = async (
    parent,
    args,
    { db, currentUser },
) => {
    if (!currentUser) {
        throw new Error('only an authorized user can post a photo');
    }

    const newPhoto: Omit<Photo, 'id'> = {
        ...args.input,
        userID: currentUser.githubLogin,
        created: new Date(),
    };

    const { insertedId } = await db.collection('photos').insertOne(newPhoto);
    return { ...newPhoto, id: insertedId };
};

export const mutation: MutationResolvers<ContextType> = {
    githubAuth: githubAuth,
    postPhoto: postPhoto,
};
