import React from 'react';
import { Row, Table } from 'antd';
import { formatMoney } from '../../../../utils/common';

type Props = {
  orderProducts: any[];
}
const ProductsData = (props: Props) => {
  const { orderProducts } = props;

  function getColumns() {
    return [{
      title: 'Imagen',
      dataIndex: 'image',
      key: 'image',
      render: (text: string, record: any) => <div
        className='products-data__image'
        style={{ backgroundImage: `url("${text}")` }}
      ></div>
    }, {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity'
    }, {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: string, record: any) => `$${formatMoney(record.price)}`
    }]
  }
  function getData() {
    if (!orderProducts) return [];

    return orderProducts.map(orderProduct => {
      return {
        key: orderProduct.product_variant.id,
        image: orderProduct.images.length > 0 ? `${process.env.serverUrl}${orderProduct.images[0].image}` : `${process.env.applicationUrl}/logo.png`,
        name: `${orderProduct.product_variant.product_name} ${orderProduct.product_variant.name}`,
        quantity: orderProduct.quantity,
        price: orderProduct.price
      }
    })
  }
  return (<Row className='products-data'>
    <Table className='product-data__table' columns={getColumns()} dataSource={getData()} style={{ width: '100%' }} pagination={false} />
  </Row>)
}

export default ProductsData;