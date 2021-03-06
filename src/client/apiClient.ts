import fetch from 'cross-fetch';

export class ApiClient {
     
    async fetchUrl(url:string,headers?:any,method?:string,payload?:string) {
        const res = await fetch(url,{
            method: method,
            headers: headers,
            body: payload,
            mode: 'no-cors'
        })
        const resJ = await res.json();
        return resJ
    }
}