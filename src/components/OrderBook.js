import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { Factory, Exchange, web3, DRCT } from '../ethereum';
import { getOrderBook } from '../actions/contractActions';

class OrderBook extends Component {
  handleClickRow = link => {
    let addressEl = link.currentTarget.getElementsByClassName(
      'token-address-link'
    )[0];
    if (typeof addressEl !== 'undefined') {
      this.openContractDetails(
        link,
        addressEl.getAttribute('data-token-address')
      );
    }
  };

  renderRows() {
    this.state.orderbook.map(order => {
      const { orderId, address, price, quantity, date } = order;

      let symbol = 'BTC/USD'; /*CURRENTLY USING STATIC SYMBOL NEED TO FIX*/

      return (
        <tr>
          <td>{orderId}</td>
          <td>
            <a
              className="link__token-address"
              onClick={this.handleRowClick}
              data-token-address={address}
            >
              <span>
                {symbol} - {this.props.contractDuration} Days -{' '}
                {this.props.contractMultiplier}X
              </span>
            </a>
          </td>
          <td>{price}</td>
          <td>{quantity}</td>
          <td>{date}</td>
        </tr>
      );
    });
  }

  render() {
    const { Body, Header, HeaderCell, Row } = Table;

    return (
      <div className="container">
        <div className="order-book">
          <Table className="positions-table" onClick={this.onClickRow}>
            <thead>
              <tr>
                <th>Order Book</th>
              </tr>
              <tr>
                <th>Order Id</th>
                <th>Asset</th>
                <th>Price (ETH)</th>
                <th>Quantity</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

OrderBook.propTypes = {
  orderbook: PropTypes.array.isRequired,
  contractDuration: PropTypes.string.isRequired,
  contractMultiplier: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  orderbook: state.contract.orderbook,
  contractDuration: state.contract.contractDuration,
  contractMultiplier: state.contract.contractMultiplier
});

export default connect(
  mapStateToProps,
  { getOrderBook }
)(OrderBook);
