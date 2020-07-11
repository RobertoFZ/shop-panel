import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { Order } from '../../../../api/Order/Order';
import { mapErrorCodeToString, mapOpenPayStatusCode } from '../../../../utils/orders';
import { formatMoney } from '../../../../utils/common';

type Props = {
  order: Order;
}
const OrderData = (props: Props) => {
  const { order } = props;
  console.log(order);
  return (order ? <Row className='order-data'>
    <Col xs={24} lg={6}>
      <p className='order-data__item'>Identificador</p>
      <p className='order-data__value'>{order.order_id}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='order-data__item'>Guía de envío</p>
      <p className='order-data__value'>{order.shipping_track_id ? order.shipping_track_id : 'Sin guía asignada'}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='order-data__item'>Estado</p>
      <p className='order-data__value'>{mapErrorCodeToString(order.status)}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='order-data__item'>Costo de envío</p>
      <p className='order-data__value-money'>${formatMoney(order.shipping_cost)}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='order-data__item'>Total</p>
      <p className='order-data__value-money'>${formatMoney(order.amount)}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='order-data__item'>Tipo de Pago</p>
      <p className='order-data__value'>{order.method === 'openpay' ? 'OpenPay' : order.method === 'paypal' ? 'PayPal' : 'Efectivo'}</p>
    </Col>
    {
      order.method == 'openpay' && <Fragment>
        <Col xs={24} lg={6}>
          <p className='order-data__item'>Código de autorización</p>
          <p className='order-data__value'>{order.authorization}</p>
        </Col>
        <Col xs={24} lg={6}>
          <p className='order-data__item'>Estatus OpenPay</p>
          <p className='order-data__value'>{mapOpenPayStatusCode(order.openpay_status_text)}</p>
        </Col>
        <Col xs={24} lg={6}>
          <p className='order-data__item'>Mensaje de error</p>
          <p className='order-data__value'>{order.error_message && order.error_message !== '' ? order.error_message : 'Sin error'}</p>
        </Col>
      </Fragment>
    }

  </Row> : null)
}

export default OrderData;