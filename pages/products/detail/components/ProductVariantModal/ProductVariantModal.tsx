import React, { Component } from 'react';
import { Modal, Button, Form, Input, InputNumber, Row, Col, Checkbox, Divider, notification } from 'antd';
import { ProductVariant } from '../../../../../api/ProductVariant/ProductVariant';
import ArcaInput from '../../../../shared/ArcaInput';

export type ProductVariantFormValues = {
  name: string;
  price: number;
  shipping_price: number;
  sku: string;
  stock: number;
  use_stock: boolean;
}

type Props = {
  productVariant?: ProductVariant;
  onSave?: Function;
  onClose?: Function;
  show: boolean;
  loading: boolean;
}

type State = {
  useStock: boolean;
}

class ProductVariantModal extends Component<Props, State> {

  state = {
    useStock: true
  }

  handleSubmit = (values: ProductVariantFormValues) => {
    const { onSave } = this.props;
    if (values.price < 0) {
      notification.warning({ message: 'Espera', description: 'No puedes colocar un precio negativo para el producto.' })
      return;
    }
    if (values.shipping_price < 0) {
      notification.warning({ message: 'Espera', description: 'No puedes colocar un costo de envío menor a $0 para el producto.' })
      return;
    }
    if (onSave) {
      values.use_stock = this.state.useStock;
      onSave(values);
    }
  }

  render() {
    const { show, productVariant, onClose, loading } = this.props;

    const initialValues = {
      name: productVariant ? productVariant.name : '',
      price: productVariant ? productVariant.price : 0,
      shipping_price: productVariant ? productVariant.shipping_price : 0,
      sku: productVariant ? productVariant.sku : '',
      stock: productVariant ? productVariant.stock : 0,
      use_stock: productVariant ? productVariant.use_stock : true
    }

    return (<Modal
      maskClosable={false}
      className='product-variant-modal'
      title={productVariant ? `Editar variante ${productVariant.name}` : 'Crear nueva variante'}
      centered
      visible={show}
      onCancel={() => onClose ? onClose() : () => { }}
      footer={null}
    >
      <Form
        name="basic"
        initialValues={initialValues}
        onFinish={this.handleSubmit}
      >
        <h3>
          Información de la variante
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          <Col xs={24}>
            <ArcaInput
              label='Nombre'
              name='name'
              rules={[{ required: true, message: 'Debes escribir un nombre para el producto' }]}
            />
          </Col>
          <Col xs={24}>
            <ArcaInput
              label='SKU'
              name='sku'
              rules={[{ required: true, message: 'Debes escribir un SKU para el producto' }]}
            />
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={8}>
            <p>Nuevo<br />precio</p>
            <ArcaInput
              name='price'
              type='money'
            />
          </Col>
          <Col xs={8}>
            <p>Nuevo precio<br />de envío</p>
            <ArcaInput
              name='shipping_price'
              type='money'
            />
          </Col>
          <Col xs={8} className='text-center'>
            <p>¿Considerar stock en compras?</p>
            <ArcaInput
              name='use_stock'
              type='checkbox'
              onChange={(checked: boolean) => this.setState({ useStock: checked })}
            />
          </Col>
          <Col xs={24}>
            <p>Stock actual</p>
            <ArcaInput
              name='stock'
              type='number'
              rules={this.state.useStock ? [{
                min: 1,
                max: 100000,
                message: 'Debes colocar un valor positivo para el stock'
              }] : []}
            />
          </Col>
        </Row>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          <Col className='text-right' xs={24}>
            <Button key="back" onClick={() => onClose ? onClose() : () => { }} style={{ marginRight: 10 }}>
              Cerrar
            </Button>
            <Button key='submit' type='primary' htmlType='submit' loading={loading}>
              Guardar
            </Button>
          </Col>
        </Row>

      </Form>
    </Modal>)
  }
}

export default ProductVariantModal;