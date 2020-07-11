import React, { Fragment } from 'react';
import { Card, Button, Row, Col, Popconfirm } from 'antd';
import { Product } from '../../../../../api/Product/Product';
import { formatMoney } from '../../../../../utils/common';
import moment from 'moment';

type Props = {
  product?: Product;
  onEdit?: Function;
  onDelete?: Function;
}

const ProductInformation = (props: Props) => {
  const { product, onEdit, onDelete } = props;

  return (<Card
    title='Información general del producto'
    className='product_information'
    loading={product ? false : true}
    extra={<Fragment>
      <Button type='link' onClick={() => onEdit ? onEdit(product) : () => { }}>Editar</Button>
      <Popconfirm
        placement='top'
        title='¿Seguro que deseas eliminar el producto?'
        onConfirm={() => onDelete ? onDelete() : () => { }}
        okText='Sí'
        cancelText='No'
      >
        <Button type='primary' danger>
          Eliminar
            </Button>
      </Popconfirm>
    </Fragment>}
  >
    {
      product && <Fragment>
        <Row>
          <Col xs={24}>
            <h3>Descripción:</h3>
            <p>{product.description}</p>
          </Col>
          <Col xs={8}>
            <h3>Precio:</h3>
            <p>${formatMoney(product.price)}</p>
          </Col>
          <Col xs={8}>
            <h3>Envío:</h3>
            <p>${formatMoney(product.shipping_price)}</p>
          </Col>
          <Col xs={8}>
            {
              new Date(product.publish_at * 1000) > new Date() ? <Fragment>
                <h3 className='text-center'>Se publica el:</h3>
                <p className='text-center'>{moment(product.publish_at * 1000).format('DD/MM/YYYY')}</p>
              </Fragment> : <Fragment>
                  <h3 className='text-center'>¿Publicado?:</h3>
                  <p className='text-center'>{product.published || new Date(product.publish_at * 1000) <= new Date() ? 'Sí' : 'No'}</p>
                </Fragment>
            }
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <h3>Categoría:</h3>
            <p>{product.subcategory.category.name}</p>
          </Col>
          <Col xs={8}>
            <h3>Subcategoría:</h3>
            <p>{product.subcategory.name}</p>
          </Col>
        </Row>
      </Fragment>
    }
  </Card>);
}


export default ProductInformation;