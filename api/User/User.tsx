import { BasicResponse, Service } from "../Service/Service";
import axios from 'axios';
import { UserFormValues } from "../../pages/shared/DashboardLayout/components/UserEditModal/UserEditModal";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: {
    facebook_id?: string;
    image_profile?: string;
  },
  token?: string;
  remember_me?: boolean;
  last_login?: Date;
}

export type UserRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile: {
    facebook_id?: string;
    image_profile?: string;
  }
}

class UserService extends Service<User> {
  protected name = 'users';
  protected url: string | undefined = process.env.apiUrl;

  async register(user: UserRequest): Promise<User> {
    try {
      const response = await axios.post<User>(`${this.url}/${this.name}/`, user, this.getHeaders());
      return response.data as User;
    } catch (error) {
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

  async update(user: User, data: UserFormValues): Promise<User> {
    try {
      const response = await axios.put<User>(`${this.url}/users/${user.id}/`, data, this.getHeaders());
      return response.data as User;
    } catch (error) { 
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

  async profile(user: User): Promise<User> {
    try {
      const response = await axios.get<BasicResponse<User>>(`${this.url}/${this.name}/${user.id}/`, this.getHeaders());
      const { data: axiosData } = response;
      return axiosData.data as User;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }
}

const service = new UserService();
export default service;
