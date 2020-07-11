import React, { Component, Fragment } from 'react';
import { Modal, Button, Form, Input, Row, Col, Checkbox, Divider, notification, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Business } from '../../../../../api/Business/Business';
import { RcFile } from 'antd/lib/upload';
import ArcaInput from '../../../ArcaInput';

const { TextArea } = Input;

export type BusinessFormValues = {
  name: string;
  description: string;
  active: boolean;
  logo: string;
}

type Props = {
  business?: Business;
  onSave?: Function;
  onClose?: Function;
  show: boolean;
  loading: boolean;
}

type State = {
  imageUrl?: string;
  businessLoading: boolean;
  isActive: boolean;
}

class BusinessEditModal extends Component<Props, State> {
  state = {
    imageUrl: undefined,
    businessLoading: false,
    isActive: false,
  }
  handleSubmit = (values: BusinessFormValues) => {
    const { onSave } = this.props;
    const { imageUrl } = this.state;
    if (onSave) {
      if (imageUrl) {
        values.logo = imageUrl.split(',')[1];
      }
      values.active = this.state.isActive;
      onSave(values);
      this.setState({ imageUrl: undefined });
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
        //const base64String = result.split(',')[1];
        this.setState({ imageUrl: result });
      })
    }
    return '';
  }

  render() {
    const { imageUrl, businessLoading } = this.state;
    const { show, business, onClose, loading } = this.props;
    const initialValues = {
      name: business ? business.name : '',
      description: business ? business.description : '',
      active: business ? business.active : false,
    }

    const uploadButton = (
      <div>
        {businessLoading || loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">{business && business.logo ? 'Cambiar' : 'Agregar'}</div>
      </div>
    );

    if (!business) return null;

    return (<Modal
      maskClosable={false}
      className='business-modal'
      title={`Editar ${business.name}`}
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
          Información de la empresa
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
              label='Descripción'
              name='description'
              type='textarea'
              rules={[{ required: true, message: 'Debes escribir una descripción para el producto' }]}
            />
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} className='text-center'>
            <ArcaInput
              label='¿Está activa para que los clientes compren?'
              name='active'
              type='checkbox'
              valuePropName='checked'
              onChange={(checked: boolean) => this.setState({ isActive: checked })}
            />

          </Col>
        </Row>
        <h3>
          Logo (Opcional)
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          {
            business && business.logo && <Col xs={24} className='text-center'>
              <p>Logo actual:</p>
              <img className='business-modal__preview' src={`${process.env.serverUrl}${business.logo}`} />
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
            <Button key="back" onClick={() => onClose ? onClose() : () => { }} style={{ marginRight: 10 }}>
              Cerrar
            </Button>
            <Button key='submit' type='primary' htmlType='submit' loading={loading || businessLoading}>
              Guardar
            </Button>
          </Col>
        </Row>

      </Form>
    </Modal>)
  }
}

export default BusinessEditModal;