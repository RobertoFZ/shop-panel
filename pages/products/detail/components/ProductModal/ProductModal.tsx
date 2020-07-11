import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col, Divider, notification, TreeSelect } from 'antd';
import { Product, Subcategory } from '../../../../../api/Product/Product';
import moment from 'moment';
import { Category } from '../../../../../api/Category/Category';
import ArcaInput from '../../../../shared/ArcaInput';

const { TreeNode } = TreeSelect;

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  shipping_price: number;
  published?: boolean;
  publish_at: any;
  engine_title: string;
  engine_description: string;
  subcategory_id: any;
}

type Props = {
  product?: Product;
  onSave?: Function;
  onClose?: Function;
  show: boolean;
  loading: boolean;
  subcategories: Subcategory[];
}

type State = {

}

class ProductModal extends Component<Props, State> {

  handleSubmit = (values: ProductFormValues) => {
    const { onSave } = this.props;
    if (values.price <= 0) {
      notification.warning({ message: 'Espera', description: 'Debes colocar un precio de al menos $1 para el producto.' })
      return;
    }
    if (values.shipping_price < 0) {
      notification.warning({ message: 'Espera', description: 'No puedes colocar un costo de envío menor a $0 para el producto.' })
      return;
    }
    if (onSave) {
      values.publish_at = values.publish_at.toDate().getTime() / 1000;
      if (values.engine_description === '') {
        values.engine_description = values.name;
      }
      if (values.engine_title === '') {
        values.engine_title = values.description;
      }
      if (values.subcategory_id) {
        values.subcategory_id = Number(values.subcategory_id.split('-')[1]);
      }
      onSave(values);
    }
  }

  render() {
    const { show, product, onClose, loading, subcategories } = this.props;

    if (!process.browser) return null;

    const initialValues = {
      name: product ? product.name : '',
      description: product ? product.description : '',
      price: product ? product.price : 0,
      shipping_price: product ? product.shipping_price : 0,
      published: product ? product.published : false,
      publish_at: product ? moment(product.publish_at * 1000) : moment(),
      engine_title: product ? product.engine_title : '',
      engine_description: product ? product.engine_description : '',
      subcategory_id: product ? `${product.subcategory.category.id}-${product.subcategory_id}` : ''
    }

    let categories: any = [];

    if (subcategories.length > 0) {
      categories = subcategories.map((subcategory: Subcategory) => subcategory.category);
      categories = categories.map((category: Category) => {
        return {
          ...category,
          subcategories: subcategories.filter((subcategory: Subcategory) => subcategory.category.id === category.id)
        }
      })
    }

    return (<Modal
      maskClosable={false}
      className='product-modal'
      title={product ? `Editar ${product.name}` : 'Crear nuevo producto'}
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
          Información del producto
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <ArcaInput
          label='Nombre'
          name='name'
          rules={[{ required: true, message: 'Debes escribir un nombre para el producto' }]}
        />
        <ArcaInput
          label='Descripción'
          name='description'
          rules={[{ required: true, message: 'Debes escribir una descripción para el producto' }]}
          type='textarea'
        />
        <Form.Item
          className='arca-input'
          label='Subcategoría'
          name='subcategory_id'
          rules={[{ required: true, message: 'Debes seleccionar una subcategoría para el producto' }]}
        >
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            allowClear
            treeDefaultExpandAll
          >
            {
              categories.map((category: Category & { subcategories: Subcategory[] }) => <TreeNode key={`${category.id}-0`} disabled value={`${category.id}-0`} title={category.name}>
                {
                  category.subcategories.map((subcategory: Subcategory) => <TreeNode key={`${category.id}-${subcategory.id}`} value={`${category.id}-${subcategory.id}`} title={subcategory.name} />)
                }
              </TreeNode>)
            }
          </TreeSelect>
        </Form.Item>
        <Row gutter={10}>
          <Col xs={8}>
            <ArcaInput
              label='Precio'
              name='price'
              type='money'
            />
          </Col>
          <Col xs={8}>
            <ArcaInput
              label='Precio de envío'
              name='shipping_price'
              type='money'
            />
          </Col>
          <Col xs={8} className='text-center'>
            <ArcaInput
              label='¿Publicado?'
              name='published'
              type='checkbox'
            />
          </Col>
          <Col xs={24}>
            <ArcaInput
              label='Fecha de publicación (Opcional)'
              name='publish_at'
              type='datepicker'
            />
          </Col>
        </Row>

        <h3>
          SEO en buscadores (Opcional)
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          <Col xs={24}>
            <ArcaInput
              label='Nombre del producto'
              name='engine_title'
            />
          </Col>
          <Col xs={24}>
            <ArcaInput
              label='Descripción breve del producto'
              name='engine_description'
              type='textarea'
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

export default ProductModal;