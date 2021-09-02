import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { web3Client } from './client/web3Client';
import { ApiClient } from './client/apiClient';
const defaultAddress = '0x416FE47A146636e90dd3A97135d32E4C6C70dBF2';
const apikey = 'XBAM22W3DU61ZWPGIIE7ZJX9BJHR3QJQXZ';

const initialiseWeb3 = async (address?:string,startblock?:string) => {
  const client = new web3Client();
  const apiClient = new ApiClient();

  client.connect();
  const web3 = client.web3();
  const blockNumber = await web3?.eth.getBlockNumber();
  //@ts-ignore
  const transactionCount = await web3?.eth.getTransactionCount(defaultAddress)

  const res = await apiClient.fetchUrl(`http://api.etherscan.io/api?module=account&action=txlist&address=${address||defaultAddress}&startblock=${startblock||0}&endblock=${blockNumber}&sort=asc&apikey=${apikey}`)

  res.result.forEach(async (element:any) => {
    const transaction = await web3?.eth.getTransaction(element.hash);
    element['value'] = transaction?.value
  });
  const blockOnDate  = await getBalanceOnDate()
  console.log(blockOnDate,'blockOnDate');
  const resblock = await apiClient.fetchUrl(`http://api.etherscan.io/api?module=account&action=balancehistory&address=${address||defaultAddress}&blockno=${blockOnDate}&apikey=${apikey}`)
  console.log(resblock,'resblock')

}

const getBalanceOnDate = async (date?:string,address?:string) => {
  const apiClient = new ApiClient();
  const timestamp = Date.parse('2021-08-11 00:00:00')/1000;
  const res = await apiClient.fetchUrl(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apikey}`)
  if(res.message === 'OK') {
    return res.result
  }
  return
}

function App() { 

  useEffect(() => {
    initialiseWeb3()
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
