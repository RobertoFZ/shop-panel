import React, { Component } from 'react';
import { Modal, Button, Form, Input, Row, Col, Divider, Upload, message, Select } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { Subcategory } from '../../../../api/Subcategory/Subcategory';
import { Category } from '../../../../api/Category/Category';
import ArcaInput from '../../../shared/ArcaInput';

const { TextArea } = Input;
const { Option } = Select;

export type SubategoryFormValues = {
  name: string;
  description: string;
  category_id: number;
  image: string;
}

type Props = {
  categories: Category[],
  subcategory?: Subcategory;
  onSave?: Function;
  onClose?: Function;
  show: boolean;
  loading: boolean;
}

type State = {
  imageUrl?: string;
  subcategoryLoading: boolean;
  isActive: boolean;
}

class SubcategoryModal extends Component<Props, State> {
  form: any;

  state = {
    imageUrl: undefined,
    subcategoryLoading: false,
    isActive: false,
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { show } = this.props;
    console.log(prevProps);
    if (this.form && prevProps.show && prevProps.subcategory && !show) {
      this.form.resetFields();
    }
    if (this.form && !prevProps.show && !prevProps.subcategory && show) {
      this.form.resetFields();
    }
  }

  handleSubmit = (values: SubategoryFormValues) => {
    const { onSave } = this.props;
    const { imageUrl } = this.state;
    if (onSave) {
      if (imageUrl) {
        values.image = imageUrl.split(',')[1];
      }
      onSave(values);
      this.setState({ imageUrl: undefined });
      if (this.form) {
        this.form.resetFields();
      }
    }
  }

  /* LOGO METHODS */
  getBase64 = (img: File, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Los formatos aceptados son JPG/PNG', 3);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB', 3);
    }
    return isJpgOrPng && isLt2M;
  }

  handleUpload = async (file: RcFile) => {
    if (this.beforeUpload(file)) {
      this.getBase64(file, (result: string) => {
        this.setState({ imageUrl: result });
      });
    }
    return '';
  }

  closeModal = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  render() {
    const { imageUrl, subcategoryLoading } = this.state;
    const { show, subcategory, loading } = this.props;

    const initialValues = {
      name: subcategory ? subcategory.name : '',
      description: subcategory ? subcategory.description : '',
      category_id: subcategory ? subcategory.category_id : ''
    }

    const uploadButton = (
      <div>
        {subcategoryLoading || loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">{subcategory && subcategory.image ? 'Cambiar' : 'Agregar'}</div>
      </div>
    );

    if (!process.browser) return null;

    return (<Modal
      maskClosable={false}
      className='subcategory-modal'
      title={subcategory ? `Editar ${subcategory.name}` : 'Nueva subcategoría'}
      centered
      visible={show}
      onCancel={this.closeModal}
      footer={null}
    >
      <Form
        ref={(ref) => this.form = ref}
        name="basic"
        initialValues={initialValues}
        onFinish={this.handleSubmit}
      >
        <h3>
          Información de la subcategoría
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          <Col xs={24}>
            <p>Categoría</p>
            <Form.Item
              name='category_id'
              rules={[{ required: true, message: 'Debes seleccionar una categoría' }]}
            >
              <Select>
                {
                  this.props.categories.map((category: Category) => <Option value={category.id}>{category.name}</Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <ArcaInput
              label='Nombre'
              name='name'
              rules={[{ required: true, message: 'Debes escribir un nombre para la subcategoría' }]}
            />
          </Col>
          <Col xs={24}>
            <ArcaInput
              label='Descripción'
              name='description'
              rules={[{ required: true, message: 'Debes escribir una descripción para la subcategoría' }]}
              type='textarea'
            />
          </Col>
        </Row>
        <h3>
          Imagen (Opcional)
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          {
            subcategory && subcategory.image && <Col xs={24} className='text-center'>
              <p>Imagen actual:</p>
              <img className='subcategory-modal__preview' src={`${process.env.serverUrl}${subcategory.image}`} />
            </Col>
          }
          <Col xs={24} className='text-center'>
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={this.beforeUpload}
              action={this.handleUpload}
            >
              {imageUrl && !loading ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Col>
        </Row>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          <Col className='text-right' xs={24}>
            <Button key="back" onClick={this.closeModal} style={{ marginRight: 10 }}>
              Cerrar
            </Button>
            <Button key='submit' type='primary' htmlType='submit' loading={loading || subcategoryLoading}>
              Guardar
            </Button>
          </Col>
        </Row>

      </Form>
    </Modal>)
  }
}

export default SubcategoryModal;