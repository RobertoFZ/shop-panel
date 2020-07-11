import React, { Component } from 'react'
import { Result, Button, Typography } from 'antd';
import './SubscriptionResult.scss';

const { Paragraph, Text } = Typography;

class SubscriptionResult extends Component {
    render() {
        return (
            <div>
                <Result
                    status="success"
                    title="Suscripción"
                    extra={[
                    /*<Paragraph>
                       Fecha en la que se unió: dd/mm/aaaa
                    </Paragraph>,
                    <Paragraph>
                        Fin de Suscripción: dd/mm/aaaa
                    </Paragraph>,
                    <Paragraph>
                        Costo de la suscripción: $0000
                    </Paragraph>,*/
                    <Button type="primary" key="console">
                        Renovar Suscripción
                    </Button>
                    ]}
                    
                />
                <div className="ad">
                    <Paragraph>
                        <Text className="ad-text"
                        strong
                        style={{
                            fontSize: 16,
                        }}
                        >
                        Nos encontramos trabajando en el sistema de suscripción para 
                        proporcionarte nuevas mejoras, espéralo pronto.
                        </Text>
                    </Paragraph>
                </div>
            </div>
        )
    }
}

export default SubscriptionResult
