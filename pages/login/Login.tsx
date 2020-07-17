import React, { Component } from 'react';
import Router from "next/router";
import { Row, Col, message, Divider } from 'antd';
import { Cookie, withCookie } from 'next-cookie';
import AuthService from '../../api/Auth';
import './Login.scss';
import LoginForm from './components/LoginForm';
import Container from '../shared/Container';
import CenterHorizontal from '../shared/CenterHorizontal';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { setUser, clearUser } from '../../utils/common';
import BaseMeta from '../shared/BaseMeta';

type Props = {
  cookie?: Cookie;
};
type State = {
  loading: boolean;
};

type FormValues = {
  email: string,
  password: string,
  remember_me: boolean,
}

class Login extends Component<Props, State> {
  state = {
    loading: false,
  }

  componentDidMount(){
    clearUser(this.props, localStorage);
  }

  doLogin = async (values: FormValues) => {
    this.setState({ loading: true });
    try {
      const user = await AuthService.login({
        username: values.email,
        password: values.password,
      });
      user.remember_me = values.remember_me;
      user.last_login = new Date();

      setUser(user, this.props, localStorage);
      Router.push('/business');
    } catch (error) {
      message.error(error.message);
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div className={'login'}>
        <BaseMeta/>
        <Container>
          <Row>
            <Col xs={24} lg={{ span: 12, offset: 6 }} xl={{ span: 8, offset: 8 }}>
              <CenterHorizontal>
                <img className='login__logo' src='/logo.png' />
              </CenterHorizontal>
              <h1 className='login__title'>Iniciar sesión</h1>
              <LoginForm onSubmit={this.doLogin} loading={loading} />
              <Row gutter={16}>
                <Col span={24}>
                  <Divider style={{ marginTop: 0 }} />
                </Col>
                <Col xs={24}>
                  <p className='login__help_text text-center'>
                    ¿Aún no tienes una cuenta?<br /><Link href='/signup'><a>Reg&iacute;strate <ArrowRightOutlined /></a></Link>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withCookie(Login);