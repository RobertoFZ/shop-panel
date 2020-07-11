import React, { Component } from 'react';
import { Button, Form, Input, Row, Col, Divider } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

type Props = {
  onSubmit: Function;
  loading?: boolean
}

type State = {
}

class CreateForm extends Component<Props, State> {
  render() {
    const { onSubmit } = this.props;
    return (<Form
      className='login_form'
      initialValues={{ name: '', descripction: '' }}
      onFinish={(values) => onSubmit(values)}
    >
      <Form.Item
        name='name'
        rules={[{ required: true, message: 'Escribe el nombre del negocio' }]}
      >
        <Input placeholder='Escribe el nombre del negocio' />
      </Form.Item>

      <Form.Item
        name='description'
        rules={[{ required: true, message: 'Debes escribir una descripción de tu negocio' }]}
      >
        <Input.TextArea placeholder='Escribe una descripción de tu negocio' />
      </Form.Item>

      {
        /*
        <Form.Item
        name='logo'
        rules={[{ required: true, message: 'Seleccione el logo de su negocio' }]}
      >
        <Upload action="upload.do" listType="picture">
            <Button>
                <UploadOutlined/> Seleccionar logo
            </Button>
        </Upload>
      </Form.Item>
        */
      }

      <Row gutter={16}>
        <Col span={24}>
          <Divider />
        </Col>
        <Col xs={24} md={16}>
          <p className='business__help_text'>
            ¿Ya cuentas con un negocio?<br /><Link href='/business'><a>Iniciar <ArrowRightOutlined /></a></Link>
          </p>
        </Col>
        <Col className='text-right' xs={24} md={8}>
        <Button loading={this.props.loading} type="primary" htmlType="submit" className='login__form__register'>
            CREAR
            </Button>
        </Col>
      </Row>
    </Form>)
  }
}

export default CreateForm;