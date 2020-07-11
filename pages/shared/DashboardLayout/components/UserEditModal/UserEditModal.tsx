import React, { Component, Fragment } from 'react';
import { Modal, Button, Form, Input, Row, Col, Checkbox, Divider, notification, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { User } from '../../../../../api/User/User';
import { RcFile } from 'antd/lib/upload';
import ArcaInput from '../../../ArcaInput';

const { TextArea } = Input;

export type UserFormValues = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile:{
    facebook_id: string;
    image_profile: string;
  }
}

type Props = {
  user?: User;
  onSave?: Function;
  onClose?: Function;
  show: boolean;
  loading: boolean;
}

type State = {
  imageUrl?: string;
  userLoading: boolean;
  isActive: boolean;
}

class UserEditModal extends Component<Props, State> {
  state = {
    imageUrl: undefined,
    userLoading: false,
    isActive: false,
  }
  handleSubmit = (values: UserFormValues) => {
    const { onSave } = this.props;
    const { imageUrl } = this.state;
    if (onSave) {
      if (imageUrl) {
        values.profile = { image_profile: imageUrl.split(',')[1], facebook_id: null};
      }
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
    const { imageUrl, userLoading } = this.state;
    const { show, user, onClose, loading } = this.props;

    const initialValues = {
      email: user ? user.email : '',
      first_name: user ? user.first_name : '',
      last_name: user ? user.last_name : '',
    }

    const uploadButton = (
      <div>
        {userLoading || loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">{user && user.profile.image_profile ? 'Cambiar' : 'Agregar'}</div>
      </div>
    );

    if (!user) return null;

    return (<Modal
      maskClosable={false}
      className='user-edit-modal'
      title={`Editar al usuario ${user.first_name}`}
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
          Información del usuario
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          <Col xs={24}>
            <ArcaInput
              name="first_name"
              label="Nombre(s)"
                type="text"
                  rules={[{
                    required:true,
                    message: 'Debe escribir su nombre'
                  }]}
            />
          </Col>
          <Col xs={24}>
            <ArcaInput
              name="last_name"
              label="Apellidos(s)"
                type="text"
                  rules={[{
                    required:true,
                    message: 'Debe escribir su nombre'
                  }]}
            />
          </Col>
          <Col xs={24}>
            <ArcaInput
              name="email"
              label="Correo"
                type="text"
                  rules={[{
                    required:true,
                    message: 'Debe escribir su correo electronico'
                  }]}
            />
          </Col>
        </Row>
        <h3>
          Imagen (Opcional)
        </h3>
        <Divider style={{ background: '#bdbdbd' }} />
        <Row>
          {
            user && user.profile.image_profile && <Col xs={24} className='text-center'>
              <p>Imagen actual:</p>
              <img className='business-modal__preview' src={`${process.env.serverUrl}${user.profile.image_profile}`} />
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
            <Button key='submit' type='primary' htmlType='submit' loading={loading || userLoading}>
              Guardar
            </Button>
          </Col>
        </Row>

      </Form>
    </Modal>)
  }
}

export default UserEditModal;