import { createServer, IncomingMessage, ServerResponse } from 'http'
import { Authorizer } from '../Authorization/Authorizer';
import { LoginHandler } from './LoginHandler';
import { UserHandler } from './UserHandler';
import { Utils } from './Utils';

export class Server {
    private authorizer: Authorizer = new Authorizer();
    public createServer(){
        createServer(
            async (req: IncomingMessage, res: ServerResponse) => {

                const basePath = Utils.getUrlBasePath(req.url);
                
                switch (basePath) {
                    case 'login':
                        await new LoginHandler(req, res, this.authorizer).handleRequest();
                        break;
                    case 'user':
                        await new UserHandler(req, res, this.authorizer).handleRequest();
                        break;
                    default:
                        break;
                }

                res.end();
            }
        ).listen(8080);

        console.log('Server start with port 8080');
    }
} 