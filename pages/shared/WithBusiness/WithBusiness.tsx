import React, { Component } from 'react';
import Router from "next/router";
import { NextComponentType } from 'next';
import { Business } from '../../../api/Business/Business';
import { getSelectedBusiness } from '../../../utils/common';
import Loader from '../Loader';

type Props = {
};
type State = {
  loading: boolean;
  selectedBusiness?: Business
};

const WithBusiness = <P extends object>(WrappedComponent: any) =>
  class extends Component<P & Props, State> {
    state = {
      loading: true,
      selectedBusiness: undefined
    }
    componentDidMount() {
      const selectedBusiness = getSelectedBusiness(localStorage);
      if (!selectedBusiness) {
        this.sendToBusinessSelection();
      }
      this.setState({ loading: false });
    }

    sendToBusinessSelection() {
      Router.push('/business');
    }

    render() {
      const { loading } = this.state;
      return loading ? <Loader loading={loading} fullHeight={true} /> : <WrappedComponent {...this.props} />;
    }
  }

export default WithBusiness;