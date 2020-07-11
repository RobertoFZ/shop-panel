import { Service } from "../Service/Service";
import axios from 'axios';
//import { DeliveryData } from "../../pages/payment/components/DeliveryForm/DeliveryForm";

export type Customer = {
  id: number;
  name: string;
  email: string;
  address: string;
  colony: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export type CustomerPaginate = {
  count: number;
  next: string;
  previous: string;
  results: Customer[];
}

class CustomerService extends Service<Customer> {
  protected name = 'customers';
  protected url: string | undefined = process.env.apiUrl;

  async list(page: number = 1, limit: number = 9, business_id: number): Promise<CustomerPaginate> {
    try {
      let params: any = {
        page,
        limit,
        offset: (page - 1) * limit
      };
      const response = await axios.get<CustomerPaginate>(`${this.url}/business/${business_id}/${this.name}/`, this.getHeaders({ params }));
      return response.data as CustomerPaginate;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

}

const service = new CustomerService();
export default service;
