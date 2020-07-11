import React, { Component } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

type Props = {
  onSubmit: Function;
  loading?: boolean
}

type State = {
  remember_me: boolean;
}

class LoginForm extends Component<Props, State> {
  state = {
    remember_me: true,
  }
  render() {
    const { onSubmit } = this.props;
    return (<Form
      className='login_form'
      initialValues={{
        email: '',
        password: ''
      }}
      onFinish={(values) => {
        values.remember_me = this.state.remember_me;
        onSubmit(values)
      }}
    >
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

      <div className='login_form__bottom'>
        <Form.Item name="remember_me" valuePropName="remember_me">
          <Checkbox
            checked={this.state.remember_me}
            onChange={(event) => this.setState({ remember_me: event.target.checked })}
          >Recordarme</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button loading={this.props.loading} type="primary" htmlType="submit" className='login__form__register'>
            INICIAR SESI&Oacute;N
        </Button>
        </Form.Item>
      </div>
    </Form>)
  }
}

export default LoginForm;