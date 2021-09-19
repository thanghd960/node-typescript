import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { UsersDbAccess } from "../User/UsersDbAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { Utils } from "./Utils";

export class UserHandler extends BaseRequestHandler {
    
    private userDbAccess: UsersDbAccess = new UsersDbAccess();
    
    constructor(req: IncomingMessage, res: ServerResponse){
        super(req, res);
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