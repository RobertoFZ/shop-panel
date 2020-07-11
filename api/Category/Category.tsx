import { Service } from "../Service/Service";
import axios from 'axios';

export type Category = {
  id: number;
  name: string;
  description: string;
  image?: string;
  business_id: number;
}

class CategoryService extends Service<Category> {
  protected name = 'categories';
  protected url: string | undefined = process.env.apiUrl;

  async list(business_id: number): Promise<Category[]> {
    try {
      let params: any = {};
      const response = await axios.get<Category[]>(`${this.url}/business/${business_id}/${this.name}/`, this.getHeaders({ params }));
      return response.data as Category[];
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async create(business_id: number, data: any): Promise<Category> {
    try {
      const response = await axios.post<Category>(`${this.url}/business/${business_id}/${this.name}/`, data, this.getHeaders());
      return response.data as Category;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async update(business_id: number, category_id: number, data: any): Promise<Category> {
    try {
      const response = await axios.put<Category>(`${this.url}/business/${business_id}/${this.name}/${category_id}/`, data, this.getHeaders());
      return response.data as Category;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async destroy(business_id: number, category_id: number): Promise<{}> {
    try {
      await axios.delete<Category>(`${this.url}/business/${business_id}/${this.name}/${category_id}/`, this.getHeaders());
      return
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

const service = new CategoryService();
export default service;
