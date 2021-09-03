import { web3Client } from './client/web3Client';
import { ApiClient } from './client/apiClient';
import { Actions } from './App';

export const getAddressTransactions = async (dispatch:any,address:string,startblock?:string,setLoading?:(v:boolean)=>void) => {
    const client = new web3Client();
    const apiClient = new ApiClient();
    client.connect();
    const web3 = client.web3();
    const blockNumber = await web3?.eth.getBlockNumber();
    
    const res = await apiClient.fetchUrl(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startblock||0}&endblock=${blockNumber}&sort=asc&apikey=${process.env.APIKEY}`,Headers)
    const transactionList:any = [] ;
    res.result.forEach(async (element:any) => {
      const transaction = await web3?.eth.getTransaction(element.hash);
      transactionList.push({...element,value:transaction?.value})
    });
    dispatch(Actions.loadTransactions({data:res.result}))
    setLoading && setLoading(false)
    // await web3?.eth.getBalance(address, blockOnDate, (err:any,bal:any) => {
    // });
    //const resblock = await apiClient.fetchUrl(`http://api.etherscan.io/api?module=account&action=balancehistory&address=${address||defaultAddress}&blockno=${blockOnDate}&apikey=${apikey}`)
    //console.log(resblock,'resblock')
}


export async function getBalanceInRange(address:string, Block:number) {
    const apiClient = new ApiClient();
    const headers = {
      "X-API-KEY": process.env.REACT_APP_XAPIKEY,
      "Content-Type": "application/json",
    }
    const body = JSON.stringify({
      query: `query ($network: EthereumNetwork!, $address: String!) {
        ethereum(network: $network) {
          address(address: {is: $address}) {
            balances(height: {lteq: ${Block}}) {
              currency {
                symbol
                address
                name
                decimals
              }
              value
              history {
                value
                transferAmount
                block
                timestamp
              }
            }
          }
        }
      }`,
      variables: {
        "network": "ethereum",
        "address": address,
        "block": Block
      }
    });
  
    const res  = await apiClient.fetchUrl(
      'https://graphql.bitquery.io',
      headers,
      'POST',
      body
    )
      
    if(res.data.ethereum.address[0] && res.data.ethereum.address[0].balances.length > 0 ){
      return res.data.ethereum.address[0].balances
    }
    if(res.data.ethereum.address[0] && res.data.ethereum.address[0].balances.length === 0 ){
      return [{"currency":{"symbol": "ETH"},"value": 0}]
    }
    return []
}

export const getBalanceOnDate = async (dispatch:any,date:string,address:string,setLoading?:(v:boolean)=>void) => {
    const apiClient = new ApiClient();
    const timestamp = Date.parse(date)/1000;
    const res = await apiClient.fetchUrl(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${process.env.REACT_APP_APIKEY}`)
    if(res.message === 'OK') {
      const result  = await getBalanceInRange(address,res.result)
      dispatch(Actions.loadBalance({data: result}))
      setLoading && setLoading(false)
      return res.result
      
    }
    setLoading && setLoading(false)
    return
}