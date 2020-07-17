import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { Business } from '../../../../../api/Business/Business';

const BusinessDropdown = ({ business, onEdit, onLogout, onConfig }: { business: Business, onEdit: Function, onLogout: Function, onConfig: Function }) => {
  const menu = (
    <Menu>
      <Menu.Item key='profile' onClick={() => onEdit(business)}>
        <Button type='link' style={{ color: '#212121' }}>Editar</Button>
      </Menu.Item>
      {/*
      <Menu.Item key='configuration' onClick={() => onConfig(business)}>
        <Button type='link' style={{ color: '#212121' }}>Configuración</Button>
      </Menu.Item>
      */}
      <Menu.Divider />
      <Menu.Item key='logout' onClick={() => onLogout()}>
        <Button type='link' ><LogoutOutlined /> Salir</Button>
      </Menu.Item>
    </Menu>
  );

  return (business ? <Dropdown overlay={menu} trigger={['click']}>
    <div className='business-dropdown'>
      <div className='business-dropdown__image' style={{
        backgroundImage: business.logo ? `url("${process.env.serverUrl}${business.logo}")` : `url("${process.env.applicationUrl}/user-default.png")`
      }} />
      {business.name} <DownOutlined />
    </div>
  </Dropdown> : null);
}

export default BusinessDropdown;