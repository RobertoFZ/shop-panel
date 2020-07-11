import React, { Component, Fragment } from 'react';
import { Modal, Button, Form, Input, Row, Col, Checkbox, Divider, notification, Upload, message } from 'antd';
import ArcaInput from '../../../ArcaInput';
import { Business } from '../../../../../api/Business/Business';
import BusinessConfigurationForm from './BusinessConfigurationForm';

export type BusinessConfigurationFormValues = {
  free_delivery_amount?: number;
}

type Props = {
  business?: Business;
  onSave?: Function;
  onClose?: Function;
  show: boolean;
  loading: boolean;
}

type State = {
  freeShippingAmount?: number;
  businessLoading: boolean;
  isActive: boolean;
}

class BusinessConfigurationModal extends Component<Props, State>{
  state = {
    freeShippingAmount: null,
    businessLoading: false,
    isActive: false
  };

  handleSubmit = (values: BusinessConfigurationFormValues) => {
    this.props.onSave(values);
  }

  render() {
    const { business, show, onClose, loading } = this.props;
    const { freeShippingAmount, businessLoading } = this.state;
    if (!business) {
      return null;
    }
    const initialValues = {
      free_delivery_amount: business.business_settings ? business.business_settings.free_delivery_amount : 0
    }
    if (!business) return null;

    return (
      <Modal
        maskClosable={false}
        className='business-modal'
        title={`Configuración de ${business.name}`}
        centered
        visible={show}
        onCancel={() => onClose ? onClose() : () => { }}
        footer={null}
      >
        <BusinessConfigurationForm
          onClose={onClose}
          initialValues={initialValues}
          businessLoading={loading}
          handleSubmit={this.handleSubmit}
        />
      </Modal>
    )

  }


}


export default BusinessConfigurationModal;