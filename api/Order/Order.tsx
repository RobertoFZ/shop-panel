import { Service } from "../Service/Service";
import axios from 'axios';
import { Customer } from "../Customer/Customer";
import { Product } from "../Product/Product";
//import { DeliveryData } from "../../pages/payment/components/DeliveryForm/DeliveryForm";

export type Order = {
  id: number;
  customer: Customer;
  business: any;
  order_id: string;
  shipping_track_id?: string;
  status: number;
  shipping_cost: number;
  amount: number;
  openpay_id: string;
  openpay_order_id: string;
  authorization: string;
  openpay_status_text: string;
  error_message: string;
  openpay?: any;
  order_products: any[];
  method: 'openpay' | 'paypal' | 'cash';
}

export type OrderRequest = {
  products: Array<{
    product_variant_id: number;
    quantity: number;
  }>,
  token_id: string;
  device_id: string;
  //customer: DeliveryData;
}

export type OrderResponse = {
  data: Order[],
  openpay_3d_secure_url: string
}

export type OrderPaginate = {
  count: number;
  next: string;
  previous: string;
  results: Order[];
}

class OrderService extends Service<Order> {
  protected name = 'orders';
  protected url: string | undefined = process.env.apiUrl;

  async list(page: number = 1, limit: number = 9, business_id: number): Promise<OrderPaginate> {
    try {
      let params: any = {
        page,
        limit,
        offset: (page - 1) * limit
      };
      const response = await axios.get<OrderPaginate>(`${this.url}/business/${business_id}/${this.name}/`, this.getHeaders({ params }));
      return response.data as OrderPaginate;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async make(data: OrderRequest): Promise<OrderResponse> {
    try {
      let params: any = {};
      const response = await axios.post<OrderResponse>(`${this.url}/${this.name}/`, data, this.getHeaders({ params }));
      return response.data as OrderResponse;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async get(order_id: string): Promise<Order> {
    try {
      let params: any = {};
      const response = await axios.get<Order>(`${this.url}/${this.name}/${order_id}/`, this.getHeaders({ params }));
      return response.data as Order;
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

const service = new OrderService();
export default service;
