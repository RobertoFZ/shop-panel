import React, { Component } from 'react';
import Router from "next/router";
import { Row, Col, message, Divider, notification } from 'antd';
import { Cookie, withCookie } from 'next-cookie';
import './Signup.scss';
import UserService from '../../api/User';
import Container from '../shared/Container';
import CenterHorizontal from '../shared/CenterHorizontal';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import SignupForm from './components/SignupForm/SignupForm';
import { setUser } from '../../utils/common';

type Props = {
  cookie?: Cookie;
};
type State = {
  loading: boolean;
};

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  profile: {
    facebook_id?: string;
    image_profile?: string;
  }
}

class Signup extends Component<Props, State> {
  state = {
    loading: false,
  }

  doSignup = async (values: FormValues) => {
    try {
      if (this.validData(values)) {
        this.setState({ loading: true });
        values.profile = {
          facebook_id: undefined,
          image_profile: undefined
        }
        const user = await UserService.register(values);
        user.remember_me = false;
        user.last_login = new Date();

        setUser(user, this.props, localStorage);
        Router.push('/business');
      }
    } catch (error) {
      message.error(error.message, 4);
      this.setState({ loading: false });
    }
  }

  /**
   * Validates the form data
   */
  validData = (values: FormValues) => {
    if (this.isEmpty(values.first_name)) {
      notification.warning({ message: 'Espera', description: 'No puedes dejar vacío tu nombre.' });
      return false;
    }
    if (this.isEmpty(values.last_name)) {
      notification.warning({ message: 'Espera', description: 'No puedes dejar vacío tu apellido.' });
      return false;
    }
    if (this.isEmpty(values.email)) {
      notification.warning({ message: 'Espera', description: 'No puedes dejar vacío tu correo electrónico.' });
      return false;
    }
    if (this.isEmpty(values.password)) {
      notification.warning({ message: 'Espera', description: 'No puedes dejar vacío tu contraseña.' });
      return false;
    }
    if (values.password !== values.confirm_password) {
      return false;
    }
    return true;
  }

  isEmpty = (value: string) => {
    return value.trim() === '';
  }

  render() {
    const { loading } = this.state;
    return (
      <div className={'signup'}>
        <Container>
          <Row>
            <Col xs={24} lg={{ span: 12, offset: 6 }} xl={{ span: 8, offset: 8 }}>
              <CenterHorizontal>
                <img className='signup__logo' src='/logo-white.png' />
              </CenterHorizontal>
              <h1 className='signup__title'>Registro</h1>
              <SignupForm onSubmit={this.doSignup} loading={loading} />
              <Row gutter={16}>
                <Col span={24}>
                  <Divider style={{ marginTop: 0 }} />
                </Col>
                <Col xs={24}>
                  <p className='signup__help_text text-center'>
                    ¿Ya tienes una cuenta?<br /><Link href='/login'><a>Inicia sesi&oacute;n <ArrowRightOutlined /></a></Link>
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

export default withCookie(Signup);