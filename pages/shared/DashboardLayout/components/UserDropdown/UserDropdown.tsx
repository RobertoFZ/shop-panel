import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { User } from '../../../../../api/User/User';
import { LogoutOutlined, DownOutlined } from '@ant-design/icons';

import Link from 'next/link';

const UserDropdown = ({ user, onLogout, onEditUser }: { user: User, onLogout: Function, onEditUser: Function }) => {
  const menu = (
    <Menu>
      <Menu.Item key='profile' onClick={() => onEditUser(user)}>
        <Button type='link' style={{ color: '#212121' }}>Editar</Button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout'>
        <Button type='link' onClick={() => onLogout()}><LogoutOutlined /> Cerrar sesión</Button>
      </Menu.Item>
    </Menu>
  );

  return (user ? <Dropdown overlay={menu} trigger={['click']}>
    <div className='user-dropdown'>
      <div className='user-dropdown__image' style={{
        backgroundImage: user.profile.image_profile ? `url("${process.env.serverUrl}${user.profile.image_profile}")` : `url("${process.env.applicationUrl}/user-default.png")`
      }} />
      {user.first_name} <DownOutlined />
    </div>
  </Dropdown> : null);
}

export default UserDropdown;