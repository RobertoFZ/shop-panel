import React, { Component } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

type Props = {
  onSubmit: Function;
  loading?: boolean
}

type State = {
}

class SignupForm extends Component<Props, State> {
  render() {
    const { onSubmit } = this.props;
    return (<Form
      className='signup_form'
      initialValues={{ remember: true }}
      onFinish={(values) => onSubmit(values)}
    >
      <Form.Item
        name='first_name'
        rules={[{ required: true, message: 'Escribe tu nombre' }]}
      >
        <Input placeholder='Escribe tu nombre' />
      </Form.Item>
      <Form.Item
        name='last_name'
        rules={[{ required: true, message: 'Escribe tu apellido' }]}
      >
        <Input placeholder='Escribe tu apellido' />
      </Form.Item>
      <Form.Item
        name='email'
        rules={[{ required: true, message: 'Escribe tu correo' }]}
      >
        <Input placeholder='Escribe tu correo' />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[{ required: true, message: 'Debes escribir tu contraseña' }]}
      >
        <Input.Password placeholder='Escribe tu contraseña' />
      </Form.Item>
      <Form.Item
        name='confirm_password'
        rules={[{ required: true, message: 'Confirma tu contraseña' }]}
      >
        <Input.Password placeholder='Confirmar contraseña' />
      </Form.Item>

      <div className='signup_form__bottom'>
        <Form.Item>
          <Button loading={this.props.loading} type="primary" htmlType="submit" className='signup__form__register'>
            REGISTRARME
        </Button>
        </Form.Item>
      </div>
    </Form>)
  }
}

export default SignupForm;