import React from 'react';
import { Row, Col } from 'antd';
import Container from '../Container';

const LogoContainer = () => <div className='navbar__logo_container'>
  <img className='navbar__logo' src='/logo.png' alt='Twosoft logo' />
</div>

const Navbar = () => (
  <div className='navbar'>
    <Container>
      <Row>
        <Col xs={24} md={12}>
          <LogoContainer/>
        </Col>
      </Row>
    </Container>
  </div>
)

export default Navbar;