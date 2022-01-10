import React, {Component} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import campaigns from '../ethereum/campaign';
import {web3, isConnected} from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
  state = {
    contribution: '',
    message: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});
    const campaign = campaigns(this.props.address);
    try {
      await isConnected();
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contribution, 'ether')
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({errorMessage: err.message})
    }
    this.setState({loading: false});
  }
  render() {
    return (
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> 
          {/*-we use error message string as true/false-->*/}
          <Form.Field>                                                  
            <label>Amount to Contribute</label>
            <Input
              label='ether' 
              labelPosition='right'
              value={this.state.contribution}
              onChange={event => this.setState({contribution: event.target.value})}
            />
          </Form.Field>
          <Message error header='Oops!' content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>Contribute!</Button>
        </Form>
    );
  };
};

export default ContributeForm;
