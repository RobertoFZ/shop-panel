import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { ProductPaginate, Product } from '../../../../api/Product/Product';
import { formatMoney } from '../../../../utils/common';
import Link from 'next/link';

type Props = {
  onDelete: Function;
  pagination?: TablePaginationConfig,
  products?: ProductPaginate,
  loading?: boolean;
};
type State = {};
class ProductsTable extends Component<Props, State> {

  getDataSource = () => {
    const { products } = this.props;
    if (!products) {
      return [];
    }
    return products.results.map((product: Product) => {
      return {
        key: product.id,
        image: product.images.length > 0 ? `${process.env.serverUrl}${product.images[0].image}` : '/logo.png',
        name: product.name,
        description: product.description,
        price: `$${formatMoney(product.price)}`
      }
    })
  }
  render() {

    const columns = [
      {
        title: 'Imagen',
        dataIndex: 'image',
        key: 'image',
        render: (text: string) => <div className='products-table__image' style={{ backgroundImage: `url("${text}")` }}></div>
      },
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Descripción',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Precio',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Acciones',
        dataIndex: 'accions',
        key: 'accions',
        render: (text: string, record: any, index: number) => (
          <span>
            <Link href={`/products/detail/${record.key}`}>
              <a style={{ marginRight: '16px' }}>
                Ver
              </a>
            </Link>
            <Popconfirm
              placement='left'
              title='¿Seguro que deseas eliminar el producto?'
              onConfirm={() => this.props.onDelete(record.key)}
              okText='Sí'
              cancelText='No'
            >
              <Button type='link'>
                Eliminar
            </Button>
            </Popconfirm>
          </span>
        ),
      }
    ];
    return (<Table
      className='products-table'
      dataSource={this.getDataSource()}
      columns={columns} pagination={this.props.pagination}
      loading={this.props.loading}
    />);
  }
}

export default ProductsTable;