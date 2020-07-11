import React, { Component } from 'react';
import { Row, Col, message, notification } from 'antd';
import BusinessService from '../../../api/Business';
import './BusinessCreation.scss';
import Container from '../../shared/Container';
import CenterHorizontal from '../../shared/CenterHorizontal';
import { getUser, setSelectedBusiness } from '../../../utils/common';
import Router from 'next/router';
import BaseMeta from '../../shared/BaseMeta';
import WithAuthentication from '../../shared/WithAuthentication';
import CreateForm from './components/index';

type Props = {

};
type State = {
  loading: boolean;
};

type FormValues = {
  name: string,
  description: string,
  logo: string,
}

class BusinessCreation extends Component<Props, State> {

  state = {
    loading: false,
  }

  /**Validates the form data */
  validData = (values: FormValues) => {
    if (values.name == "") {
      notification.warning({ message: 'Espera', description: 'No puedes dejar el nombre del negocio vacio' })
      return false
    }
    if (values.description == "") {
      notification.warning({ message: 'Espera', description: 'Tienes que agregar una descripción del negocio' })
      return false
    }
    /*
    if(values.logo == ""){
      notification.warning({message: 'Espera', description: 'Tienes que agregar un logo a tu negocio'})
      return false
    }
    */
    return true;
  }

  create = async (values: FormValues) => {
    this.setState({ loading: true });
    try {
      const user = getUser(null, localStorage);
      if (this.validData(values)) {
        this.setState({ loading: true });
        const business = await BusinessService.create({
          name: values.name,
          description: values.description,
          active: true,
          //logo: values.logo,
        })
        setSelectedBusiness(business, localStorage);
        Router.push('/');
      }
    } catch (error) {
      message.error(error.message);
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div className={'business'}>
        <BaseMeta />
        <Container>
          <Row>
            <Col xs={24} lg={{ span: 12, offset: 6 }} xl={{ span: 10, offset: 7 }}>
              <CenterHorizontal>
                <img className='business__logo' src='/logo-white.png' />
              </CenterHorizontal>
              <h1 className='business__title'>Crea un negocio</h1>
              <p className='text-center text-white'>
                Crea tu negocio para acceder<br />al panel de administración
                </p>
            </Col>
          </Row>
          <Row>
            <Col xs={24} lg={{ span: 12, offset: 6 }} xl={{ span: 10, offset: 7 }}>
              <CreateForm onSubmit={this.create} loading={loading} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default WithAuthentication(BusinessCreation);