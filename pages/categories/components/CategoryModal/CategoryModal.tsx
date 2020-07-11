import React, { Component } from 'react';
import { Modal, Button, Form, Input, Row, Col, Checkbox, Divider, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { Category } from '../../../../api/Category/Category';
import ArcaInput from '../../../shared/ArcaInput';

const { TextArea } = Input;

export type CategoryFormValues = {
  name: string;
  description: string;
  image: string;
}

type Props = {
  category?: Category;
  onSave?: Function;
  onClose?: Function;
  show: boolean;
  loading: boolean;
}

type State = {
  imageUrl?: string;
  categoryLoading: boolean;
  isActive: boolean;
}

class CategoryModal extends Component<Props, State> {
  form: any;

  state = {
    imageUrl: undefined,
    categoryLoading: false,
    isActive: false,
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { show } = this.props;
    if (this.form && prevProps.show && prevProps.category && !show) {
      this.form.resetFields();
    }
    if (this.form && !prevProps.show && !prevProps.category && show) {
      this.form.resetFields();
    }
  }

  handleSubmit = (values: CategoryFormValues) => {
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
      })
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
    const { imageUrl, categoryLoading } = this.state;
    const { show, category, onClose, loading } = this.props;

    const initialValues = {
      name: category ? category.name : '',
      description: category ? category.description : '',
    }

    const uploadButton = (
      <div>
        {categoryLoading || loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">{category && category.image ? 'Cambiar' : 'Agregar'}</div>
      </div>
    );

    return (<Modal
      maskClosable={false}
      className='category-modal'
      title={category ? `Editar ${category.name}` : 'Nueva categoría'}
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
          Información de la categoría
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          <Col xs={24}>
            <ArcaInput
              label='Nombre'
              name='name'
              rules={[{ required: true, message: 'Debes escribir un nombre para la categoría' }]}
            />
          </Col>
          <Col xs={24}>
            <ArcaInput
              label='Descripción'
              name='description'
              rules={[{ required: true, message: 'Debes escribir una descripción para la categoría' }]}
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
            category && category.image && <Col xs={24} className='text-center'>
              <p>Imagen actual:</p>
              <img className='category-modal__preview' src={`${process.env.serverUrl}${category.image}`} />
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
            <Button key='submit' type='primary' htmlType='submit' loading={loading || categoryLoading}>
              Guardar
            </Button>
          </Col>
        </Row>

      </Form>
    </Modal>)
  }
}

export default CategoryModal;