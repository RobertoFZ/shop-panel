import React, { Component } from 'react';
import { Statistic, Card, Row, Col } from 'antd';
import { DashboardOutlined, BookOutlined, DollarCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, GiftOutlined, DollarOutlined, SmileOutlined } from '@ant-design/icons';
import './orders/Orders.scss';
import DashboardLayout from './shared/DashboardLayout';
import { Business } from '../api/Business/Business';
import { getSelectedBusiness } from '../utils/common';
import { notification, Button } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import WithAuthentication from './shared/WithAuthentication';
import Router, { withRouter, NextRouter } from 'next/router';
import { OrderPaginate, Order } from '../api/Order/Order';
import OrderService from '../api/Order';
import OrdersTable from './orders/components/OrdersTable';
import OrderModal from './orders/components/OrderModal';

import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), {ssr:false})

import { Cookie } from 'next-cookie';
import { User } from '../api/User/User';
import { getUser } from '../utils/common';

type Props = {
  router: NextRouter;
  cookie: Cookie;
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
  user?: User;
}
class Home extends Component<Props, State> {
  state = {
    business: undefined,
    pageSize: 10,
    currentPage: 1,
    orders: undefined,
    loading: false,
    showOrderModal: false,
    selectedOrder: undefined,
    user: undefined,

    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  }

componentDidMount() {
  this.setState({ user: getUser(this.props, localStorage) })
  const business = getSelectedBusiness(localStorage);
  this.setState({ business }, () => this.getOrders());
}

doLogout = () => {
  this.props.cookie.remove('user');
  Router.push('/login');
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
  const { user } = this.state;
  return (<DashboardLayout
    breadCrum={[{ text: 'Inicio', link: '/' }]}
  >
    <div className={'home'}>
      {
        /*
<div className="site-statistic-demo-card">
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Ventas este mes"
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Total en ventas de este mes"
                value={25850}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarCircleOutlined />}
                suffix="$"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Total por cobrar"
                value={9500}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarCircleOutlined />}
                suffix="$"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Productos registrados"
                value={5}
                precision={0}
                valueStyle={{ color: '#825EE4' }}
                prefix={<BookOutlined />}
                suffix=""
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Pedidos pendientes"
                value={2}
                precision={0}
                valueStyle={{ color: '#825EE4' }}
                prefix={<GiftOutlined />}
                suffix=""
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Suscripción"
                value={"Premiun"}
                valueStyle={{ color: '#825EE4' }}
                prefix={<SmileOutlined />}
                suffix=""
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div id="chart">
        <Chart options={this.state.options} series={this.state.series} type="area" height={350} />
      </div>
        */
      }
      <h1 className='home__title'>Lista de pedidos pendientes <span>{`${business ? business.name : ''}`}</span></h1>
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

export default WithAuthentication(Home);