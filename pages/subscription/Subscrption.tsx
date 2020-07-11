import React, { Component } from 'react';
import DashboardLayout from '../shared/DashboardLayout';

import './Subscription.scss'
import SubscriptionCard from './components/SubscriptionCard';
import SubscriptionResult from './components/SubscriptionResult';

class Subscription extends Component {
    render(){
        return(
            <DashboardLayout
                breadCrum={[{ text: 'Suscripción', link: '/suscription' }]}
            >
               <div>
                   {/*<SubscriptionCard />*/}
                   <SubscriptionResult />
                </div>
                <br/>                
            </DashboardLayout>
        )
    }
}

export default Subscription;