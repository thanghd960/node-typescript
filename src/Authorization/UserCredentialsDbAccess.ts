import { UserCredentials } from "../Shared/Model";
import * as Nedb from 'nedb'

export class UserCredentialsDbAccess {
    private neDb: Nedb;

    constructor(){
        this.neDb = new Nedb('databases/UserCredentials.db');
        this.neDb.loadDatabase();
    }

    public async putUserCredential (userCredentials: UserCredentials) : Promise<any> {
        return new Promise((res, rej) => {
            this.neDb.insert(userCredentials, (err: Error | null, docs: any) => {
                if (err){
                    rej(err);
                } else {
                    res(docs);
                }
            })
        });
    }

    public async getUserCredential(userName: string, password: string): Promise<UserCredentials | undefined> {
        return new Promise((res, rej) => {
            this.neDb.find({username: userName, password: password}, (err: Error, docs: UserCredentials[]) => {
                if (err){
                    rej(err);
                } else {
                    if (docs.length === 0){
                        res(undefined);
                    } else {
                        res(docs[0]);
                    }
                }
            })
        });
    }
}