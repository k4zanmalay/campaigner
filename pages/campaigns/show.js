import React, { Component } from 'react';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';
import { Card, Grid, Button} from 'semantic-ui-react';
import Layout from '../../components/layout';
import ContributeForm from '../../components/contributeForm';
import campaigns from '../../ethereum/campaign';
class CampaignShow extends Component {

  static async getInitialProps(props) {       //Next.js native function
    const campaign = campaigns(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }
  renderCards() {
    const {
      balance,
      manager,
      approversCount,
      requestsCount,
      minimumContribution
    } = this.props;
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this amount of wei to approve requests'
      },
      {
        header: requestsCount,
        meta: 'Number of requests',
        description: 'A request tries to withdraw money from the contract. Request must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of approvers',
        description: 'Number of people who have already donated to the campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign balance (ether)',
        description: 'The balance is how much money this campaign has left to spare'
      }
    ];
    return <Card.Group items={items}/>
  }
  render(){
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
