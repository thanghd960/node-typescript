import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../Shared/Model";

export abstract class BaseRequestHandler {
    protected req: IncomingMessage;
    protected res: ServerResponse;

    constructor (req: IncomingMessage, res: ServerResponse){
        this.req = req;
        this.res = res;
    }

    abstract handleRequest(): Promise<void>;

    protected async handleNotFound(){
        this.res.statusCode = HTTP_CODES.NOT_FOUND;
        this.res.write(`Not found`);
    }

    protected async getRequestBody() : Promise<any>{
        return new Promise((res, rej) => {
            let body = '';
            this.req.on('data', (data: string) => {
                body += data;
            });

            this.req.on('end', () => {
                try {
                    res(JSON.parse(body));
                } catch (error){
                    rej(error);
                }
            });
        });
    }

    protected responseJsonObject(code: HTTP_CODES, object: any){
        this.res.writeHead(code, { 'Content-Type': 'application/json' });
        this.res.write(JSON.stringify(object));
    }
    
    protected responseBadRequest(message: string) {
        this.res.statusCode = HTTP_CODES.BAD_REQUEST;
        this.res.write(message);
    }

    protected responseUnauthorized(message: string){
        this.res.statusCode = HTTP_CODES.UNAUTHORIZED;
        this.res.write(message);

    }
}