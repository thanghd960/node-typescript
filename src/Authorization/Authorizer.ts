import { Account, SessionToken, TokenGenerator } from "../Server/Model";
import { UserCredentialsDbAccess } from "./UserCredentialsDbAccess";
import { SessionTokenDbAccess } from "./SessionTokenDbAccess";
export class Authorizer implements TokenGenerator {

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
}