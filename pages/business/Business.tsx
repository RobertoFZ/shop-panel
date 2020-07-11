import React, { Component } from 'react';
import { Row, Col, Select, notification, Button, Divider } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Business as BusinessClass } from './../../api/Business/Business';
import BusinessService from './../../api/Business';
import './Business.scss';
import Container from '../shared/Container';
import CenterHorizontal from '../shared/CenterHorizontal';
import Link from 'next/link';
import { setSelectedBusiness, clearSelectedBusiness, getUser } from '../../utils/common';
import Router from 'next/router';
import BaseMeta from '../shared/BaseMeta';
import WithAuthentication from '../shared/WithAuthentication';

const { Option } = Select;

type Props = {
};
type State = {
  loading: boolean;
  selectedBusiness?: number | string;
  business: BusinessClass[];
};

class Business extends Component<Props, State> {
  state = {
    loading: false,
    selectedBusiness: undefined,
    business: []
  }

  componentDidMount() {
    clearSelectedBusiness(localStorage);
    this.getBusiness();
  }

  getBusiness = async () => {
    this.setState({ loading: true });
    try {
      let business = await BusinessService.list();
      const user = getUser(null, localStorage);
      business = business.filter((business) => business.users.includes(user.id));
      this.setState({ business, loading: false });
    } catch (error) {
      notification.warning({ message: 'Ups', description: 'No pudimos recuperar tu lista de negocios' });
      this.setState({ loading: false });
    }
  }

  handleOnChange = (value: number | string) => {
    this.setState({ selectedBusiness: value });
  }

  selectBusiness = () => {
    let { selectedBusiness, business } = this.state;
    if (!selectedBusiness || selectedBusiness === '') {
      notification.warning({ message: 'Espera', description: 'Debes seleccionar un negocio para poder continuar.' });
      return
    }
    selectedBusiness = business.find((business: BusinessClass) => business.id === selectedBusiness);
    setSelectedBusiness(selectedBusiness, localStorage);
    Router.push('/');
  }

  render() {
    const { loading, business, selectedBusiness } = this.state;
    return (
      <div className={'business'}>
        <BaseMeta/>
        <Container>
          <Row>
            <Col xs={24} lg={{ span: 12, offset: 6 }} xl={{ span: 10, offset: 7 }}>
              <CenterHorizontal>
                <img className='business__logo' src='/logo-white.png' />
              </CenterHorizontal>
              <h1 className='business__title'>Selecciona un negocio</h1>
              <p className='text-center text-white'>
                Selecciona uno de tus negocios para acceder<br />al panel de administración
                </p>
              <Select
                style={{ width: '100%' }}
                placeholder='Selecciona el negocio'
                loading={loading}
                value={selectedBusiness || ''}
                onChange={this.handleOnChange}
                allowClear
              >
                <Option value={''} disabled>Selecciona un negocio</Option>
                {
                  business.map((business: BusinessClass) => <Option key={business.id} value={business.id}>{business.name}</Option>)
                }
              </Select>
              <Row gutter={16}>
                <Col span={24}>
                  <Divider />
                </Col>
                <Col xs={24} md={16}>
                  <p className='business__help_text'>
                    ¿Aún no cuentas con un negocio?<br /><Link href='/business/create'><a>Crea uno <ArrowRightOutlined /></a></Link>
                  </p>
                </Col>
                <Col className='text-right' xs={24} md={8}>
                  <Button disabled={loading} type="primary" onClick={this.selectBusiness}>
                    SELECCIONAR
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default WithAuthentication(Business);