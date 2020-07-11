import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { Collection } from '../../../../api/Collection/Collection';


type Props = {
  onEdit: Function;
  onDelete: Function;
  pagination?: TablePaginationConfig,
  collections?: Collection[],
  loading?: boolean;
};
type State = {};
class CollectionTable extends Component<Props, State> {
  SHOW_IMAGE = false;

  getDataSource = () => {
    const { collections } = this.props;
    if (!collections) {
      return [];
    }
    return collections.map((collection: Collection) => {
      return {
        key: collection.id,
        image: collection.image ? `${process.env.serverUrl}${collection.image}` : null,
        name: collection.name,
        description: collection.description,
      }
    })
  }
  render() {
    const columns = [
      {
        title: 'Imagen',
        dataIndex: 'image',
        key: 'image',
        render: (text: string) => text ? <div className='collections-table__image' style={{ backgroundImage: `url("${text}")` }}></div> : 'Sin imagen'
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
              title='¿Seguro que deseas eliminar la colección?'
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
      className='collections-table'
      dataSource={this.getDataSource()}
      columns={columns} pagination={this.props.pagination}
      loading={this.props.loading}
    >
    </Table>
    );
  }
}

export default CollectionTable;