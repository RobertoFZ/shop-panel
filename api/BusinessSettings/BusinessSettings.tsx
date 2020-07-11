import { Service } from "../Service/Service";
import axios from 'axios';

export type BusinessSettings = {
    id?:number,
    free_delivery_amount:number
}

class BusinessSettingsService extends Service<BusinessSettings> {
    protected name = 'business_settings';
    protected url: string | undefined = process.env.apiUrl;

    async create(business_id:number, business_settings:BusinessSettings):Promise<BusinessSettings> {
        try{
            const data = { ...business_settings, business_id  }
            const response = await axios.post<BusinessSettings>(`${this.url}/business/${business_id}/${this.name}/`, data, this.getHeaders());
            return response.data as BusinessSettings;
        }catch(error) {
            console.log(error);
            if (error.response) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error(error.message);
            }
        }
    }

    async update(business_id:number, business_settings_id:number, business_settings:BusinessSettings):Promise<BusinessSettings> {
        try{
            const data = { ...business_settings, business_id  }
            const response = await axios.put<BusinessSettings>(`${this.url}/business/${business_id}/${this.name}/${business_settings_id}/`, data, this.getHeaders());
            return response.data as BusinessSettings;
        }catch(error) {
            console.log(error);
            if (error.response) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error(error.message);
            }
        }
    }
    

}

const service = new BusinessSettingsService();
export default service;