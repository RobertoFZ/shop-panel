import { BasicResponse, Service } from "../Service/Service";
import axios from 'axios';
import { User } from "../User/User";

export interface Auth {
}

type AuthResponse = User & {

}

class AuthService extends Service<Auth> {
  protected name = 'auth';
  protected url: string | undefined = process.env.apiUrl;

  async login(credentials: { username: string, password: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${this.url}/${this.name}/login/`, credentials);
      return response.data as AuthResponse;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }
}

const service = new AuthService();
export default service;
