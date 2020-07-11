import axios from 'axios';
import { getUser } from '../../utils/common';

export interface Model {
  id?: number | string;
  [prop: string]: any;
}

export interface Response<T extends Model> {
  status: number;
  message: string;
  data: T[] | T;
}

export interface BasicResponse<T> {
  status: number;
  message: string;
  data: T[] | T;
}

export abstract class Service<T extends Model> {

  protected name: string | undefined = undefined;
  protected url: string | undefined = process.env.apiUrl;

  async find(): Promise<T[]> {
    try {
      const response = await axios.get<Response<T>>(`${this.url}/${this.name}`);
      return response.data.data as T[];
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async findOne(id: number): Promise<T> {
    try {
      const response = await axios.get<Response<T>>(`${this.url}/${this.name}/${id}`);
      return response.data.data as T;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  protected getHeaders(params = {}) {
    try {
      const user = getUser(null, localStorage);
      if (user) {
        return {
          headers: {
            Authorization: `Token ${user.token}`,
          },
          ...params
        }
      } else {
        return params
      }
    } catch (error) {
      return params
    }
  }
}