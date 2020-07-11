import React, { Component } from 'react';
import { Table, Card, Button, Popconfirm, Modal } from 'antd';
import { Product } from '../../../../../api/Product/Product';
import { chunkArray, formatMoney } from '../../../../../utils/common';
import { ProductVariant } from '../../../../../api/ProductVariant/ProductVariant';

type ProductImage = { id: number, image: string };

type Props = {
  product?: Product;
  onAdd?: Function;
  onDelete?: Function;
}

type State = {
  selectedImage?: { key: number, image: string };
  selectedPage: number
}

class ProductVariantsTable extends Component<Props, State> {
  PAGE_SIZE = 10;
  state = {
    selectedImage: undefined,
    selectedPage: 1
  }

  getDataSource = () => {
    const { selectedPage } = this.state;
    const { product } = this.props;
    if (!product || product.product_variants.length === 0) {
      return [];
    }
    return chunkArray(product.product_variants, this.PAGE_SIZE)[selectedPage - 1].map((variant: ProductVariant) => {
      return {
        key: variant.id,
        id: variant.id,
        name: variant.name,
        new_price: variant.price ? `$${formatMoney(variant.price)}` : 'No sustituye al original',
        shipping_cost: variant.shipping_price ? `$${formatMoney(variant.shipping_price)}` : 'No sustituye al original',
        sku: variant.sku,
        stock: variant.stock,
        use_stock: variant.use_stock ? 'Si' : 'No'
      }
    });
  }

  onShowImage = (image: { key: number, image: string }) => {
    this.setState({ selectedImage: image });
  }

  render() {
    const { product, onAdd } = this.props;
    const { selectedImage, selectedPage } = this.state;
    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Nuevo precio',
        dataIndex: 'new_price',
        key: 'new_price'
      },
      {
        title: 'Nuevo Costo de envío',
        dataIndex: 'shipping_cost',
        key: 'shipping_cost'
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        key: 'sku'
      },
      {
        title: 'En stock',
        dataIndex: 'stock',
        key: 'stock'
      },
      {
        title: 'Considerar stock en compras',
        dataIndex: 'use_stock',
        key: 'use_stock'
      },
      {
        title: 'Acciones',
        dataIndex: 'accions',
        key: 'accions',
        render: (text: string, record: any, index: number) => (
          <span>
            <Popconfirm
              placement='left'
              title='¿Seguro que deseas eliminar esta variante?'
              onConfirm={() => this.props.onDelete ? this.props.onDelete(record.key) : () => { }}
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
    return (<Card
      title='Variantes del producto, lo que tu cliente puede comprar'
      className='images-table'
      loading={product ? false : true}
      extra={<Button type='link' onClick={() => onAdd ? onAdd() : () => { }}>Agregar</Button>}
    >
      {
        product && <Table
          dataSource={this.getDataSource()}
          columns={columns}
          pagination={{
            total: product.images.length,
            pageSize: this.PAGE_SIZE,
            current: selectedPage,
            onChange: (page) => this.setState({ selectedPage: page }),
            position: ['bottomRight']
          }}
        />
      }
      <Modal
        title='Vista previa'
        centered
        visible={this.state.selectedImage}
        footer={[
          <Button key="back" onClick={() => this.setState({ selectedImage: undefined })}>
            Cerrar
          </Button>,
        ]}
      >
        {selectedImage && <img className='images-table__preview' src={selectedImage.image} />}
      </Modal>
    </Card>);
  }
}

export default ProductVariantsTable;