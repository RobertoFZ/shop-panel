import { Service } from "../Service/Service";
import axios from 'axios';
import { Category } from "../Category/Category";
import { SubategoryFormValues } from "../../pages/subcategories/components/SubcategoryModal/SubcategoryModal";

export type Subcategory = {
  id: number;
  name: string;
  description: string;
  image?: string;
  business_id: number;
  category_id: number;
  category: Category;
}

class SubcategoryService extends Service<Subcategory> {
  protected name = 'subcategories';
  protected url: string | undefined = process.env.apiUrl;

  async list(business_id: number): Promise<Subcategory[]> {
    try {
      let params: any = {};
      const response = await axios.get<Subcategory[]>(`${this.url}/business/${business_id}/${this.name}/`, this.getHeaders({ params }));
      return response.data as Subcategory[];
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async create(business_id: number, category_id: number, data: SubategoryFormValues): Promise<Subcategory> {
    try {
      const response = await axios.post<Subcategory>(`${this.url}/business/${business_id}/categories/${category_id}/${this.name}/`, data, this.getHeaders());
      return response.data as Subcategory;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async update(business_id: number, category_id: number, subcategory_id: number, data: SubategoryFormValues): Promise<Subcategory> {
    try {
      const response = await axios.put<Subcategory>(`${this.url}/business/${business_id}/categories/${category_id}/${this.name}/${subcategory_id}/`, data, this.getHeaders());
      return response.data as Subcategory;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async destroy(business_id: number, category_id: number, subcategory_id: number): Promise<{}> {
    try {
      await axios.delete<Subcategory>(`${this.url}/business/${business_id}/categories/${category_id}/${this.name}/${subcategory_id}/`, this.getHeaders());
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

const service = new SubcategoryService();
export default service;
