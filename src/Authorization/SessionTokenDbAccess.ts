import * as Nedb from 'nedb';
import { SessionToken } from '../Server/Model';


export class SessionTokenDbAccess {
    private neDb: Nedb;

    constructor(){
        this.neDb = new Nedb('databases/SessionToken.db');
        this.neDb.loadDatabase();
    }

    public async storeSessionToken(token: SessionToken): Promise<void> {
        return new Promise((res, rej) => {
            this.neDb.insert(token, (err: Error | null) => {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    };

    public async getToken(tokenId: string) : Promise<SessionToken | undefined>{
        return new Promise((res, rej) => {
            this.neDb.find({tokenId: tokenId}, (err: Error, docs: any) => {
                if (err){
                    rej(err);
                } else {
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