import { Service } from "../Service/Service";
import axios from 'axios';

export type Collection = {
    id: number;
    name: string;
    description: string;
    image?: string;
    business_id: number;
  }

class CollectionsService extends Service<Collection> {
    protected name = 'collections';
    protected url: string | undefined = process.env.apiUrl;
  
    async list(business_id: number): Promise<Collection[]> {
      try {
        let params: any = {};
        const response = await axios.get<Collection[]>(`${this.url}/business/${business_id}/${this.name}/`, this.getHeaders({ params }));
        return response.data as Collection[];
      } catch (error) {
        console.log(error);
        if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error(error.message);
        }
      }
    }

    async create(business_id: number, data: any): Promise<Collection> {
        try {
          const response = await axios.post<Collection>(`${this.url}/business/${business_id}/${this.name}/`, data, this.getHeaders());
          return response.data as Collection;
        } catch (error) {
          console.log(error);
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }
      }
    
      async update(business_id: number, collection_id: number, data: any): Promise<Collection> {
        try {
          const response = await axios.put<Collection>(`${this.url}/business/${business_id}/${this.name}/${collection_id}/`, data, this.getHeaders());
          return response.data as Collection;
        } catch (error) {
          console.log(error);
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }
      }
    
      async destroy(business_id: number, collection_id: number): Promise<{}> {
        try {
          await axios.delete<Collection>(`${this.url}/business/${business_id}/${this.name}/${collection_id}/`, this.getHeaders());
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
  
  const service = new CollectionsService();
  export default service;
  