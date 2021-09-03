import React, { useState } from 'react';
import './App.css';
import { getAddressTransactions,getBalanceOnDate } from './handlers';
import { Input, Button } from 'antd';
import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/store';
import { Switch, Route,BrowserRouter as Router,useHistory} from 'react-router-dom';
import { DatePicker,PageHeader,Empty,Spin } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
require('dotenv').config()

const dateFormat = 'YYYY/MM/DD';

export interface transactionsState {
  transactionList: any[],
  balanceList: any[]
}

const initialState: transactionsState = {
  transactionList: [],
  balanceList: []
}

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
   loadTransactions: (state,action) => {
      state.transactionList = action.payload.data
   },
   loadBalance: (state,action) => {
      state.balanceList = action.payload.data
    },
  },
})

export const Actions = transactionsSlice.actions;

  
function TransactionsCrawler () {
  const [txId, setTxId] =  useState('')
  const [startBlock, setStartBlock] =  useState('')
  const [loading, setLoading] =  useState(false)

  const dispatch = useDispatch()
  const history = useHistory();
  const transactions = useSelector((state: RootState) => state.transactions.transactionList);

  const handleSubmit = () => {
    setLoading(true)
    getAddressTransactions(dispatch,txId,startBlock,setLoading)
  }
  
  return (
    <>
      <div className="topMenu">
          <div>Trace Crawler</div>
          <div className="Bonus_Tabs" onClick={()=>history.push('/balance')}>
              Go to Balance Crawler
          </div>
      </div>
      <div className="top-container">
        <div className="header-main-text">
          Ethereum Transactions Crawler
        </div> 
        <div className="input-container">
          <Input size="large" value={txId} onChange={(e)=>setTxId(e.target.value)} placeholder="Enter transaction Id" className={"txIdfield"}/>
        
          <Input size="large" value={startBlock} type={'number'} min={0} onChange={(e)=>setStartBlock(e.target.value)} placeholder="Enter starting block number" className={"blockfield"} />
        </div>
        <div className="btnContainer">
          <Button type="primary" 
            size={'large'} 
            onClick={()=>handleSubmit()} 
            className="submitBtn"
            disabled={(txId && startBlock) === ''}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </div>
      <Spin tip="Loading..." spinning={loading}>
        <div className="transactions-container">
          <div className="pgHeader2">
              <PageHeader
                className="site-page-header"
                title="Transactions Data"
              />
          </div>
          {
            transactions.length === 0 && <Empty/>
          }
          {
            transactions.map(
              (e) => 
                <div className="transactionItemContainer"> 
                  <div className="transactionItem"> 
                    From Address : {e.from}
                  </div>
                  <div className="transactionItem"> 
                    To Address : {e.to}
                  </div>
                  <div className="transactionItem"> 
                    Transaction Amount : {e.value}
                  </div>
                  <div className="transactionItem"> 
                    BlockNumber : {e.blockNumber}
                  </div>
                  <div className="transactionItem"> 
                    gas Used: {e.gasUsed}
                  </div>
                </div>
            )
          }
        </div>
      </Spin>
    </>
  )
}

function BalanceCrawler () {
  const [txId, setTxId] =  useState('')
  const [date, setDate] =  useState('')
  const [loading, setLoading] =  useState(false)

  const history = useHistory();

  const dispatch = useDispatch()
  const balances = useSelector((state: RootState) => state.transactions.balanceList);

  const handleSubmit = () => {
    setLoading(true)
    getBalanceOnDate(dispatch,date,txId,setLoading)
  }

  const onDateChange = ( date:any, dateString:string) => {
    setDate(dateString)
  }
  
  return (
    <>
      <div className="topMenu">
          <div>Trace Crawler</div>
          <div className="Bonus_Tabs" onClick={()=>history.push('/')}>
              Go to Transactions Crawler
          </div>
      </div>
      <div className="top-container2">
        <div className="header-main-text">
          Ethereum Balance Crawler
        </div> 
        <div className="input-container">
          <Input size="large" value={txId} onChange={(e)=>setTxId(e.target.value)} placeholder="Enter transaction Id" className={"txfield"}/>
        
          <DatePicker defaultValue={moment('2015/01/01', dateFormat)} onChange={onDateChange} className={"blockfield"}/>
        </div>
        <div className="btnContainer">
          <Button type="primary" 
            size={'large'} 
            onClick={()=>handleSubmit()} 
            className="submitBtn"
            disabled={(txId && date) === ''}
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="pgHeader">
          <PageHeader
            className="site-page-header"
            title="Balance Data"
          />
      </div>
      <Spin tip="Loading..." spinning={loading}>
        <div className="balance_container">
          {
            balances.length === 0 && <Empty/>
          }
          {
            balances.map(
              e => 
                <div className="tokenCard">  
                    <div className="tokenSymbol">{e.currency.symbol}</div>
                    <div>BALANCE : {e.value}</div>
                </div>
            )
          }
        </div>
      </Spin>
    </>
  )
}

function App() { 
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/balance'>
            <BalanceCrawler/>
          </Route>
          <Route path='/'>
            <TransactionsCrawler/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
