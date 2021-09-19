import { parse, UrlWithParsedQuery } from 'url';
export class Utils {
    public static getUrlBasePath(url: string | undefined): string {
        if (url){
            const parsedUrl = parse(url);
            return parsedUrl.pathname!.split('/')[1];
        }
        return '';
    }

    public static getUrlParameter(url: string | undefined) : UrlWithParsedQuery | undefined {
        if (url){
            return parse(url, true);
        }
        return undefined;

    }
}