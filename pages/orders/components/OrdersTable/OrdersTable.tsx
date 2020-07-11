import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { formatMoney } from '../../../../utils/common';
import Link from 'next/link';
import { OrderPaginate, Order } from '../../../../api/Order/Order';
import { mapErrorCodeToString } from '../../../../utils/orders';

type Props = {
  onShow?: Function;
  pagination?: TablePaginationConfig,
  orders?: OrderPaginate,
  loading?: boolean;
};
type State = {};
class OrdersTable extends Component<Props, State> {

  getDataSource = () => {
    const { orders } = this.props;
    if (!orders) {
      return [];
    }
    return orders.results.map((order: Order) => {
      return {
        key: order.id,
        customer: order.customer.name,
        order_id: order.order_id,
        method: order.method,
        shipping_track_id: order.shipping_track_id,
        status: order.status,
        error_message: order.error_message,
        authorization: order.authorization
      }
    })
  }

  onShowClicked = (order_id: number) => {
    const { onShow, orders } = this.props;
    const order = orders.results.find((order: Order) => order_id === order.id);
    if (onShow && order) {
      onShow(order);
    }
  }

  render() {
    const { onShow } = this.props;
    const columns = [
      {
        title: 'Número de orden',
        dataIndex: 'order_id',
        key: 'order_id'
      },
      {
        title: 'Tipo de pago',
        dataIndex: 'method',
        key: 'method',
        render: (text: string) => text === 'openpay' ? 'OpenPay' : text === 'paypal' ? 'PayPal' : 'Efectivo'
      },
      {
        title: 'Número de guía',
        dataIndex: 'shipping_track_id',
        key: 'shipping_track_id',
        render: (text: string) => text && text !== "" ? text : 'Aún no se le asigna una guía'
      },
      {
        title: 'Cliente',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        render: (text: string, entity: any) => mapErrorCodeToString(entity.status)
      },
      {
        title: 'Mensaje de error',
        dataIndex: 'error_message',
        key: 'error_message',
        render: (text: string) => text && text !== "" ? text : 'No ocurrió ningún error'
      },
      {
        title: 'Acciones',
        dataIndex: 'accions',
        key: 'accions',
        render: (text: string, record: any, index: number) => (
          <span>
            <Button type='link' htmlType='button' onClick={() => this.onShowClicked(record.key)}>
              Ver
            </Button>
          </span>
        ),
      }
    ];
    return (<Table
      className='orders-table'
      dataSource={this.getDataSource()}
      columns={columns} pagination={this.props.pagination}
      loading={this.props.loading}
    />);
  }
}

export default OrdersTable;