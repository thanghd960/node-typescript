import * as Nedb from 'nedb';
import { User } from '../Shared/Model';

export class UsersDbAccess {
    private neDb: Nedb;

    constructor () {
        this.neDb = new Nedb('databases/Users.db');
        this.neDb.loadDatabase();
    }

    public async putUser(user: User): Promise<void>{
        return new Promise((res, rej) => {
            this.neDb.insert(user, (err: Error | null) => {
                if (err){
                    rej(err)
                }  else {
                    res();
                }
            });
        });
    }

    public async getUserById(userId: string): Promise<User | undefined> {
        return new Promise((res, rej) => {
            this.neDb.find({id: userId}, (err: Error, docs: any) => {
                if (err){
                    rej(err);
                } else {
                    // res(docs);
                    if (docs.length === 0){
                        res(undefined);
                    } else {
                        res(docs[0]);
                    }
                }
            });
        });
    }
}