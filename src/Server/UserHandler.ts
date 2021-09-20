import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
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
            case HTTP_METHODS.PUT:
                await this.handlePut();
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
        } else {
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

        
    }

    private async handlePut(){
        const operationAuthorized = await this.operationAuthorized(AccessRight.CREATE);
        if (!operationAuthorized){
            this.responseUnauthorized('Missing or invalid authentication');
        } else {

            try {
                const user: User = await this.getRequestBody();
        
                if (!user.id){
                    user.id = Math.random().toString(36).slice(2);
                }

                if (user) {
                    await this.userDbAccess.putUser(user);
                    this.responseText(HTTP_CODES.CREATED, `User: ${user.name} created`);
                } else {
                    this.responseBadRequest('Body is empty');
                }
            } catch (error: any) {
                this.responseBadRequest(error.message);
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