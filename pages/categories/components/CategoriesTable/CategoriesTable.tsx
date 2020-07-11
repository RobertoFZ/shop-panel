import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { ProductPaginate, Product } from '../../../../api/Product/Product';
import { formatMoney } from '../../../../utils/common';
import Link from 'next/link';
import { Category } from '../../../../api/Category/Category';

type Props = {
  onEdit: Function;
  onDelete: Function;
  pagination?: TablePaginationConfig,
  categories?: Category[],
  loading?: boolean;
};
type State = {};
class CategoriesTable extends Component<Props, State> {
  SHOW_IMAGE = false;

  getDataSource = () => {
    const { categories } = this.props;
    if (!categories) {
      return [];
    }
    return categories.map((category: Category) => {
      return {
        key: category.id,
        image: category.image ? `${process.env.serverUrl}${category.image}` : null,
        name: category.name,
        description: category.description
      }
    })
  }
  render() {

    const columns = [
      {
        title: 'Imagen',
        dataIndex: 'image',
        key: 'image',
        render: (text: string) => text ? <div className='categories-table__image' style={{ backgroundImage: `url("${text}")` }}></div> : 'Sin imagen'
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
        title: 'Acciones',
        dataIndex: 'accions',
        key: 'accions',
        render: (text: string, record: any, index: number) => (
          <span>
            <Button type='link' onClick={() => this.props.onEdit(record.key)}>
              Editar
            </Button>
            <Popconfirm
              placement='left'
              title='¿Seguro que deseas eliminar la categoría?'
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
      className='categories-table'
      dataSource={this.getDataSource()}
      columns={columns} pagination={this.props.pagination}
      loading={this.props.loading}
    />);
  }
}

export default CategoriesTable;