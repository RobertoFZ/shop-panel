import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { CustomerPaginate, Customer } from '../../../../api/Customer/Customer';

type Props = {
  onShow?: Function;
  pagination?: TablePaginationConfig,
  customers?: CustomerPaginate,
  loading?: boolean;
};
type State = {};
class CustomersTable extends Component<Props, State> {

  getDataSource = () => {
    const { customers } = this.props;
    if (!customers) {
      return [];
    }
    return customers.results.map((customer: Customer) => {
      return {
        key: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        colony: customer.colony,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        country: customer.country
      }
    })
  }

  onShowClicked = (customer_id: number) => {
    const { onShow, customers } = this.props;
    const customer = customers.results.find((customer: Customer) => customer_id === customer.id);
    if (onShow && customer) {
      onShow(customer);
    }
  }

  render() {
    const { onShow } = this.props;
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Correo electrónico',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Teléfono',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Dirección',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Colonia',
        dataIndex: 'colony',
        key: 'colony'
      },
      {
        title: 'Estado',
        dataIndex: 'state',
        key: 'state'
      },
      {
        title: 'Código postal',
        dataIndex: 'zip',
        key: 'zip'
      },
      {
        title: 'País',
        dataIndex: 'country',
        key: 'country'
      },
      /*
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
      */
    ];
    return (<Table
      className='customers-table'
      dataSource={this.getDataSource()}
      columns={columns} pagination={this.props.pagination}
      loading={this.props.loading}
    />);
  }
}

export default CustomersTable;