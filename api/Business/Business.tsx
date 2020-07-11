import { BasicResponse, Service } from "../Service/Service";
import axios from 'axios';
import { BusinessFormValues } from "../../pages/shared/DashboardLayout/components/BusinessEditModal/BusinessEditModal";
import { BusinessSettings } from "../BusinessSettings/BusinessSettings";

export type Business = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  logo: string;
  users: Array<number>;
  business_settings:BusinessSettings;
}

export type BusinessRequest = {
  name: string;
  description: string;
  active: boolean;
  logo?: string;
}

class BusinessService extends Service<Business> {
  protected name = 'business';
  protected url: string | undefined = process.env.apiUrl;

  async list(): Promise<Business[]> {
    try {
      const response = await axios.get<Business[]>(`${this.url}/${this.name}/`, this.getHeaders({ params: {} }));
      return response.data as Business[];
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async update(business: Business, data: BusinessFormValues): Promise<Business> {
    try {
      const response = await axios.put<Business>(`${this.url}/business/${business.id}/`, data, this.getHeaders());
      return response.data as Business;
    } catch (error) {
      console.log(error);
      if (error.response) {
      }
    }
  }
  
  async create(business: BusinessRequest): Promise<Business>{
    try{
      const response = await axios.post<Business>(`${this.url}/${this.name}/`, business, this.getHeaders());
      return response.data as Business;
    }catch(error){
      if (error.response) {
        if(error.response.data.non_field_errors){
          throw new Error(error.response.data.non_field_errors[0]);
        }
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }
}

const service = new BusinessService();
export default service;
