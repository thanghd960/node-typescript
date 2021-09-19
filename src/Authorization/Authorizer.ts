import { Account, SessionToken, TokenGenerator, TokenRight, TokenState, TokenValidator } from "../Server/Model";
import { UserCredentialsDbAccess } from "./UserCredentialsDbAccess";
import { SessionTokenDbAccess } from "./SessionTokenDbAccess";
export class Authorizer implements TokenGenerator, TokenValidator {
    
    private userCredentialDbAccess: UserCredentialsDbAccess = new UserCredentialsDbAccess();
    private sessionTokenDbAccess: SessionTokenDbAccess = new SessionTokenDbAccess();

    async generateToken(account: Account): Promise<SessionToken | undefined> {
        const resultAccount = await this.userCredentialDbAccess.getUserCredential(account.username, account.password);
        if (resultAccount){
            const token: SessionToken = {
                accessRights: resultAccount.accessRights,
                userName: resultAccount.username,
                expirationTime: this.generateExpirationTime(),
                valid: true,
                tokenId: this.generateRandomTokenId()
            }

            await this.sessionTokenDbAccess.storeSessionToken (token);

            return token;
        } else {
            return undefined;
        }
    }

    private generateExpirationTime() {
        return new Date(Date.now() + 60 * 60 * 1000);
    }

    private generateRandomTokenId(){
        return Math.random().toString(36).slice(2);
    }


    public async validateToken(tokenId: string): Promise<TokenRight> {
        const token = await this.sessionTokenDbAccess.getToken(tokenId);
        if (!token || !token.valid){
            console.log(`token ${tokenId} is invalid`)
            return {
                accessRight: [],
                state: TokenState.INVALID
            };
        } else if (token.expirationTime < new Date()){
            console.log(`token ${tokenId} is expired`)
            return {
                accessRight: [],
                state: TokenState.EXPIRED
            }
        } 
        return {
            accessRight: token.accessRights,
            state: TokenState.VALID
        };
    }

}