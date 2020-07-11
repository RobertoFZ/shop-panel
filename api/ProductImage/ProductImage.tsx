import { Service } from "../Service/Service";
import { Business } from './../Business/Business';
import axios from 'axios';
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

class ProductImageService extends Service<Product> {
  protected name = 'products';
  protected url: string | undefined = process.env.apiUrl;

  async create(business_id: number, product_id: number, base64String: string): Promise<Product> {
    try {
      const response = await axios.post<Product>(`${this.url}/business/${business_id}/${this.name}/${product_id}/product_images/`, {
        image: base64String
      }, this.getHeaders());
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

  async destroy(business_id: number, product_id: number, product_image_id: number): Promise<{}> {
    try {
      await axios.delete<Product>(`${this.url}/business/${business_id}/${this.name}/${product_id}/product_images/${product_image_id}/`, this.getHeaders());
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

const service = new ProductImageService();
export default service;
