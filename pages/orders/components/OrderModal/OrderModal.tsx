import React, { Component, Fragment } from 'react';
import { Modal, Button, Divider, Row, Col } from 'antd';
import './OrderModal.scss';
import { Order } from '../../../../api/Order/Order';
import CustomerData from '../CustomerData';
import OrderData from '../OrderData';
import ProductsData from '../ProductsData';

type Props = {
  order?: Order;
  show: boolean;
  onClose?: Function;
}

type State = {

}

class OrderModal extends Component<Props, State> {
  render() {
    const { order, show, onClose } = this.props;
    return (<Modal
      className='order-modal'
      title={`Pedido ${order ? order.order_id : ''}`}
      centered
      visible={show}
      onCancel={() => onClose ? onClose() : () => true}
      maskClosable={false}
      width={'80%'}
      footer={[
        <Button key="back" onClick={() => onClose ? onClose() : () => true}>
          Cerrar
        </Button>
      ]}
    >
      {
        order && <Fragment>
          <h3>Datos del cliente</h3>
          <Divider />
          <CustomerData customer={order.customer} />
          <br />
          <h3>Datos del pedido</h3>
          <Divider />
          <OrderData order={order} />
          <br />
          <h3>Productos comprados</h3>
          <Divider />
          <ProductsData orderProducts={order.order_products}/>
        </Fragment>
      }
    </Modal>)
  }
}

export default OrderModal;