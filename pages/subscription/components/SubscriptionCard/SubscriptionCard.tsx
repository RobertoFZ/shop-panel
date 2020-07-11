import React, { Component } from 'react'
import { Card } from 'antd';
import './SubscriptionCard.scss';

export class SubscriptionCard extends Component {
    render() {
        return (
            <div>
                <div className="site-card-border-less-wrapper">
                    <Card title="Detalles de la suscripción" bordered={false} style={{ width: 300 }}>
                        <p>Nombre de la suscripción</p>
                        <p>Fecha en la que se unió</p>
                        <p>Fin de la suscripción</p>
                        <p>Costo de la suscripción</p>
                    </Card>
                </div>
            </div>
        )
    }
}

export default SubscriptionCard
