import { IncomingMessage, ServerResponse } from 'http';
import { HTTP_CODES, HTTP_METHODS } from '../Shared/Model';
import { BaseRequestHandler } from './BaseRequestHandler';
import { Account, TokenGenerator } from './Model';

export class LoginHandler extends BaseRequestHandler {
    private tokenGenerator: TokenGenerator;

    public constructor (req: IncomingMessage, res: ServerResponse, tokenGenerator: TokenGenerator) {
        super(req, res);
        this.tokenGenerator = tokenGenerator;
    }

    public async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.POST:
                await this.handlePost();
                break;
        
            default:
                await this.handleNotFound();
                break;
        }
    }

    private async handlePost(){
        try {
            const body : Account = await this.getRequestBody();
            const sessionToken = await this.tokenGenerator.generateToken(body);
            if (sessionToken) {
                // this.res.write('Valid credentials');
                this.res.statusCode = HTTP_CODES.CREATED;
                this.responseJsonObject(HTTP_CODES.CREATED, sessionToken);
            } else {
                this.res.statusCode = HTTP_CODES.NOT_FOUND;
                this.res.write(`Wrong user name or password not found`);
            }    
        } catch (error) {
            this.res.write(`Error:  ${error}`);
        }
    }
}
