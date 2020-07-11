import React from 'react';
import Link from 'next/link'
import { Button, Row, Col } from 'antd';
import './PageBanner.scss';
import Navbar from '../Navbar';
import Container from '../Container';

type Props = {
  imageUrl: string;
}
const PageBanner = ({ imageUrl }: Props) => {
  return (<div className={'page_banner'} style={{ backgroundImage: `url(${imageUrl})` }}>
    <Navbar />
    <Container>
      <Row>
        <Col md={24}>
          <h1 className='page_banner__title'>Crea hoy tu propia tienda en línea.</h1>
        </Col>
        <Col md={24} lg={12}>
          <h2 className='page_banner__subtitle'>Se uno de los privilegiados en tener tu comercio electronico con nosotros.</h2>
        </Col>
        <Col md={24} style={{ marginTop: 20 }}>
          <Link href="/">
            <Button type='primary' shape='round' size='large' style={{ marginRight: 10 }}>
              Registrarme ahora
        </Button>
          </Link>

          <Link href="/business">
            <Button type='default' shape='round' size='large'>
              Comprar ahora
        </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  </div>)
}

export default PageBanner;