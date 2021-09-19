import internal = require('stream');
import { Account } from '../Server/Model';


export enum AccessRight {
    CREATE,
    READ,
    UPDATE,
    DELETE
};

export interface UserCredentials extends Account {
    accessRights:  AccessRight[]
};

export enum HTTP_CODES {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 404,
    NOT_FOUND = 404,
    UNAUTHORIZED = 401
}

export enum HTTP_METHODS {
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    GET = 'GET'
};


export interface User {
    id: string,
    name: string,
    age: number,
    email: string, 
    workingPossition: WorkingPossition
}


export enum WorkingPossition {
    JUNIOR,
    PROGRAMMER,
    ENGINNER,
    MANAGER
}

