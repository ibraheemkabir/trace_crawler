import Web3 from "web3";
import { provider, HttpProvider } from 'web3-core';

export class web3Client {
    private _web3: Web3 | undefined;
    private _netId?: number;
    private _provider?: provider|undefined;
    private _connected: boolean = false;

    async connect() {
        const prov = this.getProvider()!;
        this._web3 = new Web3('https://mainnet.infura.io/v3/6c3c8730cd504213bad96e77121a4c32'||prov);
        if((prov as any).enable){
            await (prov as any).enable();
        }
        this._connected = true;
    }

    async disconnect(): Promise<void>{
        return
    }

    connected(){
        return this._connected
    }

    web3(): Web3|undefined {
        return this._web3!;
    }

    private getProvider(): provider {
        if(!this._provider) {
            //@ts-ignore
            const win = window as any || {}
            if (win.ethereum) {
                this._provider = win.ethereum;
            } else if (win.web3) {
                this._provider = win.web3.currentProvider
            } else {
                const error = 'No web3 Provider was detected';
                throw error;
            }
        }
        return this._provider!;
    }
}