import React from 'react'
import { Button, Form, Row, Col, Divider } from 'antd';
import ArcaInput from '../../../ArcaInput';

type Props = {
    initialValues:Object;
    businessLoading:boolean;
    onClose:Function;
    handleSubmit:Function;
}

const BusinessConfigurationForm: React.FC<Props> = ( { initialValues, businessLoading, onClose, handleSubmit } : Props )  => {
    return(
        <Form
            name="businessConfig"
            initialValues={initialValues}
            onFinish={(e) => handleSubmit(e)}
        >
            <h3>Configura los detalles de tu negocio</h3>
            <Divider style={{ background: '#bdbdbd' }} />
            <Row>
                <Col xs={24} lg={24}>
                    <ArcaInput
                        name="free_delivery_amount"
                        label="Envío gratis desde"
                             type="money"
                                rules={[{ 
                                    required: true, 
                                    message: 'Debes indicar un monto para tus envíos gratis o dejarlo en 0 para desactivar esta opción' 
                                }]}
                            />
                        </Col>
                    </Row>
                    <Divider style={{ background: '#bdbdbd' }} />
                    <Row>
                        <Col className='text-right' xs={24}>
                            <Button key="back" onClick={() => onClose ? onClose() : () => { }} style={{ marginRight: 10 }}>
                                Cerrar
                            </Button>
                            <Button key='submit' type='primary' htmlType='submit' loading={ businessLoading }>
                                Guardar
                            </Button>
                        </Col>
                    </Row>
                </Form>
    )
}  

export default BusinessConfigurationForm;