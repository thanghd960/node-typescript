import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { UsersDbAccess } from "../User/UsersDbAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { TokenState, TokenValidator } from "./Model";
import { Utils } from "./Utils";

export class UserHandler extends BaseRequestHandler {
    
    private userDbAccess: UsersDbAccess = new UsersDbAccess();
    private tokenValidator: TokenValidator;

    constructor(req: IncomingMessage, res: ServerResponse, tokenValidator: TokenValidator){
        super(req, res);
        this.tokenValidator = tokenValidator;
    }

    async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            default:
                await this.handleNotFound();
                break;
        }
    }

    private async handleGet() {
        const operationAuthorized = await this.operationAuthorized(AccessRight.READ);
        if (!operationAuthorized){
            this.responseUnauthorized('Missing or invalid authentication');
        }

        const parseUrl = Utils.getUrlParameter(this.req.url);
        if (parseUrl){
            const userId = parseUrl.query.id;
            if (userId){
                const user = await this.userDbAccess.getUserById(userId as string);

                if (user) {
                    this.responseJsonObject(HTTP_CODES.OK, user);
                } else {
                    this.handleNotFound();
                }
            } else {
                this.responseBadRequest("userId not present in request");
            }
        }
    }

    private async operationAuthorized(operation: AccessRight) : Promise<boolean>{

        let isValid = false;
        const tokenId = this.req.headers.authorization;

        if (!tokenId){
            return isValid;
        }
        const token = await this.tokenValidator.validateToken(tokenId);

        const isAccessRight = token.accessRight.includes(operation);
        if (isAccessRight){
            isValid = true ;
        }

        return isValid;
    }   
}