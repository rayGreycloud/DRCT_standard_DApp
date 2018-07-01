import { Wrapped, web3 } from '../ethereum';
import {
  SET_USER_ACCOUNT,
  SET_USER_BALANCE,
  SET_USER_TRANSACTIONS,
  SET_USER_POSITIONS,
  SET_PROCESSING_ERROR,
  TX_PROCESSING,
  RESET_TX_STATE,
  SET_TX_RECEIPT
} from './types';

export const getUserAccount = () => async dispatch => {
  try {
    const userAccounts = await web3.eth.getAccounts();

    dispatch({
      type: SET_USER_ACCOUNT,
      payload: userAccounts[0]
    });
  } catch (err) {
    dispatch({
      type: SET_PROCESSING_ERROR,
      payload: err.message.split('\n')[0]
    });
  }
};

export const getUserBalance = () => async dispatch => {
  try {
    const wrapped = await Wrapped.deployed();
    const accounts = await web3.eth.getAccounts();
    let _res = await wrapped.balanceOf(accounts[0]);

    dispatch({
      type: SET_USER_BALANCE,
      payload: _res.c[0]
    });
  } catch (err) {
    dispatch({
      type: SET_PROCESSING_ERROR,
      payload: err.message.split('\n')[0]
    });
  }
};

export const getUserTransactions = userAccount => async dispatch => {
  try {
    const exchange = await Exchange.deployed();
    const factory = await Factory.at(
      '0x15bd4d9dd2dfc5e01801be8ed17392d8404f9642'
    );
    let drct;
    let _trades = [];
    let titles = ['ContractCreation']; //Add other ATS when redeployed
    let ats = [
      {
        //Sale: await exchange.Sale({}, {fromBlock:0, toBlock: 'latest'}),
        //OrderPlaced: await exchange.OrderPlaced({}, {fromBlock:0, toBlock: 'latest'}),
        //OrderRemoved: await exchange.OrderRemoved({}, {fromBlock:0, toBlock: 'latest'}),
        ContractCreation: await factory.ContractCreation(
          {},
          { fromBlock: 0, toBlock: 'latest' }
        )
        //Transfer: await drct.Transfer({}, {fromBlock:0, toBlock: 'latest'}),
        //Approval: await drct.Approval({}, {fromBlock:0, toBlock: 'latest'})
      }
    ];

    for (let i = 0; i < titles.length; i++) {
      let transferEvent = await factory.ContractCreation(
        {},
        { fromBlock: 0, toBlock: 'latest' }
      );

      const logs = await transferEvent.get();

      for (let j = logs.length - 1; j >= Math.max(logs.length - 10, 0); j--) {
        if (
          logs[i].args['_sender'].toUpperCase() == userAccount.toUpperCase()
        ) {
          _trades.push([titles[i], logs[j].transactionHash]);
        }
      }

      _trades = _trades.length === 0 ? [['No Recent Events', '...']] : _trades;

      dispatch({
        type: SET_USER_TRANSACTIONS,
        payload: _trades
      });
    }
  } catch (err) {
    dispatch({
      type: SET_PROCESSING_ERROR,
      payload: err.message.split('\n')[0]
    });
  }
};

export const getUserPositions = userAccount => async dispatch => {
  try {
    const factory = await Factory.at(
      '0x15bd4d9dd2dfc5e01801be8ed17392d8404f9642'
    );
    const _allrows = [];
    const openDates = [];
    const numDates = await factory.getDateCount();

    for (let i = 0; i < numDates; i++) {
      const startDates = (await factory.startDates.call(i)).c[0];
      const _token_addresses = await factory.getTokens(startDates);

      let _date = new Date(startDates * 1000);
      _date =
        _date.getUTCMonth() +
        1 +
        '/' +
        _date.getUTCDate() +
        '/' +
        _date.getUTCFullYear();

      openDates.push(_date);

      for (let j = 0; j < _token_addresses.length; j++) {
        let drct = await DRCT.at(_token_addresses[j]);
        let _balance = await drct.balanceOf(this.props.myAccount);
        if (_balance.c[0] > 0) {
          _allrows.push({
            address: _token_addresses[j],
            balance: _balance.c[0].toString(),
            date: _date.toString(),
            symbol: 'BTC/USD' /*CURRENTLY USING STATIC SYMBOL NEED TO FIX*/,
            contractDuration: this.state.contractDuration,
            contractMultiplier: this.state.contractMultiplier
          });
        }
      }
    }

    _allrows = _allrows.length === 0 ? [['No Recent Events', '...']] : _allrows;

    dispatch({
      type: SET_USER_POSITIONS,
      payload: _allrows
    });
  } catch (err) {
    dispatch({
      type: SET_PROCESSING_ERROR,
      payload: err.message.split('\n')[0]
    });
  }
};

export const sendCashOutRequest = () => async dispatch => {
  dispatch(resetTxState());
  dispatch(setTxProcessing());

  try {
    const wrapped = await Wrapped.deployed();
    const accounts = await web3.eth.getAccounts();
    const response = await wrapped.withdraw(this.state.myBalance, {
      from: accounts[0],
      gas: 4000000
    });

    dispatch({
      type: SET_TX_RECEIPT,
      payload: response.tx
    });
  } catch (err) {
    dispatch({
      type: SET_PROCESSING_ERROR,
      payload: err.message.split('\n')[0]
    });
  }
};

export const setTxProcessing = () => {
  return {
    type: TX_PROCESSING
  };
};

export const resetTxState = () => {
  return {
    type: RESET_TX_STATE
  };
};
