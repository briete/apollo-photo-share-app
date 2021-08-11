import { SQLDataSource } from 'datasource-sql';
import { Photo, User } from '../../types/generate';

export class Database extends SQLDataSource {
    async totalPhotos(): Promise<any> {
        const result = await this.knex.select('*').from('photos').count();
        console.log(result);
        return 1;
    }

    async allPhotos(): Promise<any> {
        const result = await this.knex.select('*').from('photos');
        return result;
    }

    async totalUsers(): Promise<any> {
        const result = await this.knex.select('*').from('users').count();
        return result;
    }

    async allUsers(): Promise<any> {
        const result = await this.knex.select('*').from('users');
        return result;
    }

    async getUser(id: string): Promise<any> {
        return await this.knex.select('*').from('users').where(`id = ${id}`);
    }

    async insertPhoto(photo: Photo): Promise<any> {
        return await this.knex('photos').insert(photo);
    }

    async insertUser(user: User): Promise<any> {
        return await this.knex('users').insert(user);
    }
}
