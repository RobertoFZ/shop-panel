import React from 'react';
import { Spin } from 'antd';

const Loader = ({
  loading,
  size,
  fullHeight = false
}: {
  loading: boolean,
  size?: 'small' | 'large',
  fullHeight?: boolean
}) => {
  return loading ? <div style={{
    height: fullHeight ? '100vh' : 'initial',
    width: '100%',
    textAlign: 'center',
    margin: '2rem 0',
    display: 'flex',
    alignItems: 'center'
  }}>
    <Spin size={size} style={{ alignItems: 'center', margin: 'auto' }} />
  </div> : null;
}

export default Loader