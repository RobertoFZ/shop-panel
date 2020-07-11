import React, { Component } from 'react';

import './Orders.scss';
import DashboardLayout from '../shared/DashboardLayout';
import { Business } from '../../api/Business/Business';
import { getSelectedBusiness } from '../../utils/common';
import { notification, Button } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import WithAuthentication from '../shared/WithAuthentication';
import Router, { withRouter, NextRouter } from 'next/router';
import { OrderPaginate, Order } from '../../api/Order/Order';
import OrderService from '../../api/Order';
import OrdersTable from './components/OrdersTable';
import OrderModal from './components/OrderModal';

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
  orders?: OrderPaginate;
  showOrderModal: boolean;
  selectedOrder?: Order;
}
class OrdersPage extends Component<Props, State> {
  state = {
    business: undefined,
    pageSize: 10,
    currentPage: 1,
    orders: undefined,
    loading: false,
    showOrderModal: false,
    selectedOrder: undefined
  }

  componentDidMount() {
    const business = getSelectedBusiness(localStorage);
    this.setState({ business }, () => this.getOrders());
  }

  getOrders = async () => {
    this.setState({ loading: true });
    try {
      const { currentPage, pageSize, business } = this.state;
      const orders = await OrderService.list(currentPage, pageSize, business.id);
      const context = this;
      this.setState({ orders });
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
      this.setState({ currentPage: page }, () => this.getOrders());
    } catch (error) {
      console.log(error);
    }

  }

  sizePageChange = async (current: number, size: number) => {
    try {
      this.setState({ pageSize: size, currentPage: 1 }, () => this.getOrders());
    } catch (error) {
      console.log(error);
    }
  }

  handleModalOpen = () => {
    const { showOrderModal } = this.state;
    this.setState({ showOrderModal: !showOrderModal });
  }

  openOrderModal = (order: Order) => {
    const { showOrderModal } = this.state;
    this.setState({ showOrderModal: !showOrderModal, selectedOrder: order });
  }

  render() {
    const { loading, business, orders, pageSize, currentPage, showOrderModal, selectedOrder } = this.state;
    return (<DashboardLayout
      breadCrum={[{ text: 'Pedidos', link: '/orders' }]}
    >
      <div className={'orders'}>
        <h1 className='orders__title'>Lista de pedidos <span> {`${business ? business.name : ''}`}</span></h1>
        <OrdersTable
          loading={loading}
          orders={orders}
          onShow={this.openOrderModal}
          pagination={{
            total: orders ? orders.count : 0,
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
        <OrderModal 
        order={selectedOrder} 
        show={showOrderModal} 
        onClose={() => this.openOrderModal(undefined)}
        />
      </div>
    </DashboardLayout>)
  }
}

export default WithAuthentication(withRouter(OrdersPage));