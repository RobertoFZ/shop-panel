import { BasicResponse, Service } from "../Service/Service";
import { Business } from './../Business/Business';
import axios from 'axios';
import { ProductFormValues } from "../../pages/products/detail/components/ProductModal/ProductModal";
import { ProductVariant } from "../ProductVariant/ProductVariant";

export type ProductPaginate = {
  count: number;
  next: string;
  previous: string;
  results: Product[];
}

export type Category = {
  id: number;
  name: string;
  description: string;
}

export type Subcategory = {
  id: number;
  name: string;
  description: string;
  category: Category;
}

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  shipping_price: number;
  published: boolean;
  publish_at: number;
  promote: boolean;
  engine_title: string;
  engine_description: string;
  business_id: number;
  business: Business;
  subcategory_id: number;
  collection_id: number;
  images: Array<{ id: number, image: string }>;
  product_variants: Array<ProductVariant>,
  subcategory: Subcategory
}

class BusinessService extends Service<Product> {
  protected name = 'products';
  protected url: string | undefined = process.env.apiUrl;

  async list(page: number = 1, limit: number = 9, order?: string, business?: Array<number>, categories?: Array<number>): Promise<ProductPaginate> {
    try {
      let params: any = {
        page,
        limit,
        offset: (page - 1) * limit
      };
      if (order) {
        params.order = order;
      }
      if (business && business.length > 0) {
        params.business = business.toString();
        if (categories && categories.length > 0) {
          params.category = categories.toString();
        }
      }
      const response = await axios.get<ProductPaginate>(`${this.url}/${this.name}/`, this.getHeaders({ params }));
      return response.data as ProductPaginate;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async findOne(product_id: number): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${this.url}/${this.name}/${product_id}`, this.getHeaders());
      return response.data as Product;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async create(business: Business, data: ProductFormValues): Promise<Product> {
    try {
      const response = await axios.post<Product>(`${this.url}/business/${business.id}/${this.name}/`, data, this.getHeaders());
      return response.data as Product;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async update(product: Product, data: ProductFormValues): Promise<Product> {
    try {
      const response = await axios.put<Product>(`${this.url}/business/${product.business_id}/${this.name}/${product.id}/`, data, this.getHeaders());
      return response.data as Product;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async destroy(business: Business, product_id: number): Promise<{}> {
    try {
      await axios.delete<Product>(`${this.url}/business/${business.id}/${this.name}/${product_id}/`, this.getHeaders());
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

const service = new BusinessService();
export default service;
