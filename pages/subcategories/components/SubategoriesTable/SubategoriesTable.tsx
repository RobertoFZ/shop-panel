import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { Category } from '../../../../api/Category/Category';
import { Subcategory } from '../../../../api/Subcategory/Subcategory';

type Props = {
  onEdit: Function;
  onDelete: Function;
  pagination?: TablePaginationConfig,
  subcategories?: Subcategory[],
  loading?: boolean;
};
type State = {};
class SubategoriesTable extends Component<Props, State> {
  SHOW_IMAGE = false;

  getDataSource = () => {
    const { subcategories } = this.props;
    if (!subcategories) {
      return [];
    }
    return subcategories.map((subcategory: Subcategory) => {
      return {
        key: subcategory.id,
        image: subcategory.image ? `${process.env.serverUrl}${subcategory.image}` : null,
        name: subcategory.name,
        description: subcategory.description,
        subcategory: subcategory.category.name
      }
    })
  }
  render() {

    const columns = [
      {
        title: 'Imagen',
        dataIndex: 'image',
        key: 'image',
        render: (text: string) => text ? <div className='subcategories-table__image' style={{ backgroundImage: `url("${text}")` }}></div> : 'Sin imagen'
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
        title: 'Categoría',
        dataIndex: 'subcategory',
        key: 'subcategory',
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
              title='¿Seguro que deseas eliminar la subcategoría?'
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
      className='subcategories-table'
      dataSource={this.getDataSource()}
      columns={columns} pagination={this.props.pagination}
      loading={this.props.loading}
    />);
  }
}

export default SubategoriesTable;