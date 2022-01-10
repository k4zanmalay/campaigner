import React, {Component} from 'react';
import { Form, Table, Button, Message } from 'semantic-ui-react';
import campaigns from '../ethereum/campaign';
import {web3, isConnected} from '../ethereum/web3';
import { Router } from '../routes';

class RequestRow extends Component {
  state = {
//    message: '',
  //  errorMessage: '',
    //loading: false
  };

  approve = async (event) => {
    event.preventDefault();
//    this.setState({loading: true, errorMessage: ''});
    const campaign = campaigns(this.props.address);
    try {
      await isConnected();
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.index).send({from: accounts[0]});
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
    //  this.setState({errorMessage: err.message})
    }
   // this.setState({loading: false});
  }
  finalize = async (event) => {
    event.preventDefault();
//    this.setState({loading: true, errorMessage: ''});
    const campaign = campaigns(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(this.props.index).send({from: accounts[0]});
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
    //  this.setState({errorMessage: err.message})
    }
   // this.setState({loading: false});
  }
  render() {
    const {index, request, approversCount} = this.props; //destructuring
    const readyToFinalize = request.approvalCount > (approversCount/2);
    return (
      <Table.Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Table.Cell>{index}</Table.Cell>
        <Table.Cell>{request.description}</Table.Cell>
        <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
        <Table.Cell>{request.recipient}</Table.Cell>
        <Table.Cell>{request.approvalCount}/{approversCount}</Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button color='green' basic onClick={this.approve}>
              Approve
            </Button>
          )}
        </Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button color='teal' basic onClick={this.finalize}>
              Finalize
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  };
};

export default RequestRow;

