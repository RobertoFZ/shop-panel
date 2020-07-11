import { Service } from "../Service/Service";
import axios from 'axios';
import { ProductFormValues } from "../../pages/products/detail/components/ProductModal/ProductModal";
import { ProductVariantFormValues } from "../../pages/products/detail/components/ProductVariantModal/ProductVariantModal";


export type ProductVariant = {
  id: number;
  name: string;
  price: number;
  shipping_price: number;
  sku: string;
  stock: number;
  use_stock: boolean;
}

class ProductVariantService extends Service<ProductVariant> {
  protected name = 'product_variants';
  protected url: string | undefined = process.env.apiUrl;


  async create(business_id: number, product_id: number, data: ProductVariantFormValues): Promise<ProductVariant> {
    try {
      const response = await axios.post<ProductVariant>(`${this.url}/business/${business_id}/products/${product_id}/${this.name}/`, data, this.getHeaders());
      return response.data as ProductVariant;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async update(business_id: number, product_id: number, product_variant_id: number, data: ProductVariantFormValues): Promise<ProductVariant> {
    try {
      const response = await axios.put<ProductVariant>(`${this.url}/business/${business_id}/products/${product_id}/${this.name}/${product_variant_id}/`, data, this.getHeaders());
      return response.data as ProductVariant;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async destroy(business_id: number, product_id: number, product_variant_id: number): Promise<{}> {
    try {
      await axios.delete<ProductVariant>(`${this.url}/business/${business_id}/products/${product_id}/${this.name}/${product_variant_id}/`, this.getHeaders());
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

const service = new ProductVariantService();
export default service;
