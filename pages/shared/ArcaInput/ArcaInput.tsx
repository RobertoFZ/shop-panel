import React from 'react';
import { Rule } from "antd/lib/form";
import { Form, Input, Checkbox, InputNumber, DatePicker } from 'antd';

const { TextArea } = Input;

export type ArcaInputProps = {
  name: string;
  label?: string;
  type?: 'text' | 'password' | 'checkbox' | 'textarea' | 'money' | 'datepicker' | 'number';
  rules?: Rule[];
  onChange?: Function;
  valuePropName?: string;
}

const ArcaInput = (props: ArcaInputProps) => {
  const {
    name,
    label,
    rules = [],
    type = 'text',
    onChange = () => true,
    valuePropName = 'value'
  } = props;

  function getInputType() {
    switch (type) {
      case 'password':
        return <Input.Password onChange={(event: any) => onChange(event.target.value)} />
      case 'checkbox':
        return <Checkbox onChange={(event: any) => onChange(event.target.checked)}></Checkbox>
      case 'textarea':
        return <TextArea rows={3} onChange={(event: any) => onChange(event.target.value)} />
      case 'money':
        return <InputNumber
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      case 'number':
        return <Input type='number' />
      case 'datepicker':
        return <DatePicker onChange={(event: any) => onChange(event.target.value)} />
      default:
        return <Input onChange={(event: any) => onChange(event.target.value)} />
    }
  }

  return (<Form.Item
    className='arca-input'
    label={label}
    labelAlign='left'
    name={name}
    rules={rules}
    valuePropName={valuePropName}
  >
    {getInputType()}
  </Form.Item>);
}

export default ArcaInput;