import React, { Component } from 'react';

import './Customers.scss';
import DashboardLayout from '../shared/DashboardLayout';
import { Business } from '../../api/Business/Business';
import { getSelectedBusiness } from '../../utils/common';
import { notification } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import WithAuthentication from '../shared/WithAuthentication';
import { withRouter, NextRouter } from 'next/router';
import { Order } from '../../api/Order/Order';
import { CustomerPaginate } from '../../api/Customer/Customer';
import CustomerService from '../../api/Customer';
import CustomersTable from './components/CustomersTable';

type Props = {
  router: NextRouter;
}
type State = {
  business?: Business;
  // Pagination
  pageSize: number;
  currentPage: number;
  //
  loading: boolean;
  customers?: CustomerPaginate;
  showCustomerModal: boolean;
  selectedOrder?: Order;
}
class Customers extends Component<Props, State> {
  state = {
    business: undefined,
    pageSize: 10,
    currentPage: 1,
    customers: undefined,
    loading: false,
    showCustomerModal: false,
    selectedOrder: undefined
  }

  componentDidMount() {
    const business = getSelectedBusiness(localStorage);
    this.setState({ business }, () => this.getCustomers());
  }

  getCustomers = async () => {
    this.setState({ loading: true });
    try {
      const { currentPage, pageSize, business } = this.state;
      const customers = await CustomerService.list(currentPage, pageSize, business.id);
      const context = this;
      this.setState({ customers });
      setTimeout(() => {
        context.setState({ loading: false });
      }, 1000);
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      notification.warning({ message: 'Ups', description: 'No pudimos recuperar la lista de pedidos.' });
    }
  }

  pageChange = async (page: number) => {
    try {
      this.setState({ currentPage: page }, () => this.getCustomers());
    } catch (error) {
      console.log(error);
    }

  }

  sizePageChange = async (current: number, size: number) => {
    try {
      this.setState({ pageSize: size, currentPage: 1 }, () => this.getCustomers());
    } catch (error) {
      console.log(error);
    }
  }

  handleModalOpen = () => {
    const { showCustomerModal } = this.state;
    this.setState({ showCustomerModal: !showCustomerModal });
  }

  openOrderModal = (order: Order) => {
    const { showCustomerModal } = this.state;
    this.setState({ showCustomerModal: !showCustomerModal, selectedOrder: order });
  }

  render() {
    const { loading, business, customers, pageSize, currentPage, showCustomerModal, selectedOrder } = this.state;
    return (<DashboardLayout
      breadCrum={[{ text: 'Clientes', link: '/customers' }]}
    >
      <div className={'customers'}>
        <h1 className='customers__title'>Lista de clientes <span>{`${business ? business.name : ''}`}</span></h1>
        <CustomersTable
          loading={loading}
          customers={customers}
          onShow={this.openOrderModal}
          pagination={{
            total: customers ? customers.count : 0,
            showTotal: (total: number, range: any) => `${range[0]}-${range[1]} de ${total} pedidos`,
            pageSize: pageSize,
            pageSizeOptions: ['10', '25', '50', '100'],
            showSizeChanger: true,
            locale: esES.Pagination,
            current: currentPage,
            onChange: this.pageChange,
            onShowSizeChange: this.sizePageChange,
            position: ['bottomLeft']
          }} />
      </div>
    </DashboardLayout>)
  }
}

export default WithAuthentication(withRouter(Customers));