import { AccessRight } from "../Shared/Model";

export interface Account {
    username: string,
    password: string
};

export interface SessionToken {
    tokenId: string,
    userName: string,
    valid: boolean,
    expirationTime: Date,
    accessRights: AccessRight[]
};

export interface TokenGenerator {
    generateToken(account: Account): Promise<SessionToken | undefined>;
}

export enum TokenState {
    VALID,
    INVALID,
    EXPIRED
}

export interface TokenRight {
    accessRight: AccessRight[],
    state: TokenState
}

export interface TokenValidator {
    validateToken(tokenId: string) : Promise<TokenRight>;
}