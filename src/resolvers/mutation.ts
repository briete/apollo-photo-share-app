import * as uuid from 'uuid';
import { authorizeGitHub } from '../helpers/github-helper';
import { MutationResolvers, Photo, User } from '../types/generate';
import { ContextType } from './resolver';

const ClientId = process.env.CLIENT_ID!;
const ClientSecret = process.env.CLIENT_SECRET!;

/**
 * GitHub認可を行いユーザーを作成する
 */
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

        // messageがある場合は、なんらかのエラーが発生しているためエラーとする
        if (message) {
            throw new Error(message);
        }

        const userInfo: User = {
            userId: uuid.v4(),
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar: avatar_url,
            postedPhotos: [],
        };

        // ユーザーを作成
        await db.insertUser(userInfo);

        return { user: userInfo, token: access_token };
    } catch (e) {
        console.error(e);
        throw new Error(e);
    }
};

/**
 * 写真を投稿する
 */
const postPhoto: MutationResolvers<ContextType>['postPhoto'] = async (
    parent,
    args,
    { db, currentUser },
) => {
    if (!currentUser) {
        throw new Error('only an authorized user can post a photo');
    }

    const newPhoto: Photo = {
        photoId: uuid.v4(),
        ...args.input,
        userId: currentUser.userId,
    };

    const { insertedId } = await db.insertPhoto(newPhoto);

    return { ...newPhoto, id: insertedId };
};

export const mutation: MutationResolvers<ContextType> = {
    githubAuth: githubAuth,
    postPhoto: postPhoto,
};
