import axios from 'axios';
import { LoginRequestResult, ProfileRequestResult } from '@/types/api.d';
import { authStorage } from '@/api/authStorage';

export async function login(username: string, password: string): Promise<LoginRequestResult> {
  try {
    const result = await axios.post('http://localhost:3000/basic/auth', { username, password });
    console.log(result.data);
    return {
      success: true,
      accessToken: result.data.access_token,
    };
  } catch (e) {
    return Promise.resolve({
      success: false,
      error: 'Username or password incorrect',
    });
  }
}

export async function user(): Promise<ProfileRequestResult> {
  const { token } = authStorage;
  try {
    if (!token) {
      throw new Error('Unauthorized');
    }
    const result = await axios.get('http://localhost:3000/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(result.data);
    return {
      success: true,
      profile: result.data,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
    };
  }
}
