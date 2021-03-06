import React, {Component} from 'react';
import Layout from '../../../components/layout';
import RequestRow from '../../../components/requestRow';
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import campaigns from '../../../ethereum/campaign';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const {address} = props.query;
    const campaign = campaigns(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestsCount)).fill().map((element, index) => {
       return campaign.methods.requests(index).call();
      })
    );
    return {address, requests, requestsCount, approversCount};
  }
  renderRequests(){
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow request={request} 
          index={index} 
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }
  render(){
    return (
      <Layout>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button floated='right' style={{marginBottom: 10}} primary>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount(ETH)</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Approval Count</Table.HeaderCell>
              <Table.HeaderCell>Approve</Table.HeaderCell>
              <Table.HeaderCell>Finalize</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderRequests()}
          </Table.Body>
        </Table>
        <div>Found {this.props.requestsCount} requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;
