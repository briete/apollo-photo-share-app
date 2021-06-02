import axios from 'axios';

export type Credentials = {
    client_id: string;
    client_secret: string;
    code: string;
};

export type AccessToken = {
    access_token: string;
    token_type: string;
    scope: string;
};

export type GitHubUser = {
    message: string;
    avatar_url: string;
    login: string;
    name: string;
};

/**
 * GitHubからアクセストークンを取得する
 * @param credentials
 * @returns
 */
const requestGitHubToken = async (
    credentials: Credentials,
): Promise<AccessToken> => {
    const res = await axios.post(
        'https://github.com/login/oauth/access_token',
        credentials,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
    );
    return res.data;
};

const requestGetHubUserAccount = async (token: string): Promise<GitHubUser> => {
    const res = await axios.get(
        `https://api.github.com/user?access_token=${token}`,
        {
            headers: {
                Authorization: `token ${token}`,
            },
        },
    );
    return res.data;
};

export async function authorizeGitHub(
    credentials: Credentials,
): Promise<AccessToken & GitHubUser> {
    const githubToken = await requestGitHubToken(credentials);
    console.log('githubToken', githubToken);
    const githubUser = await requestGetHubUserAccount(githubToken.access_token);
    console.log('githubUser', githubUser);
    return { ...githubUser, ...githubToken };
}
