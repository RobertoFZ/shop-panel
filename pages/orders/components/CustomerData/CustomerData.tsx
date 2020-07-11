import React from 'react';
import { Row, Col, Divider } from 'antd';
import { Customer } from '../../../../api/Customer/Customer';

type Props = {
  customer: Customer;
}
const CustomerData = (props: Props) => {
  const { customer } = props;
  return (customer ? <Row className='customer-data'>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>Nombre</p>
      <p className='customer-data__value'>{customer.name}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>Correo electrónico</p>
      <p className='customer-data__value'>{customer.email}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>Teléfono</p>
      <p className='customer-data__value'>{customer.phone}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>Dirección</p>
      <p className='customer-data__value'>{customer.address}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>Colonia</p>
      <p className='customer-data__value'>{customer.colony}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>Estado</p>
      <p className='customer-data__value'>{customer.state}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>Código postal</p>
      <p className='customer-data__value'>{customer.zip}</p>
    </Col>
    <Col xs={24} lg={6}>
      <p className='customer-data__item'>País</p>
      <p className='customer-data__value'>{customer.country}</p>
    </Col>
  </Row> : null)
}

export default CustomerData;