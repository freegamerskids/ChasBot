import { URL } from 'url'

export function isUrl(url: string){
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}