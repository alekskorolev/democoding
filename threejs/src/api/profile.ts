import axios from 'axios';
import { authStorage } from '@/api/authStorage';
import { AvatarUploadResult, ProfileRequestResult, ProfilesRequestResult } from '@/types/api.d';
import { NewProfileForm } from '@/types/profileState.d';

export async function getProfiles(): Promise<ProfilesRequestResult> {
  const { token } = authStorage;
  try {
    if (!token) {
      throw new Error('Unauthorized');
    }
    const result = await axios.get('http://localhost:3001/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(result.data);
    return {
      success: true,
      profiles: result.data,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: 'some error',
    };
  }
}

export async function uploadAvatar(file: File): Promise<AvatarUploadResult> {
  try {
    const formdata = new FormData();
    formdata.append('file', file);
    const result = await axios.post('http://localhost:3002/avatar', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      fileurl: result.data,
    };
  } catch (e) {
    return {
      success: false,
      error: 'Some error',
    };
  }
}

export async function createProfile(profile: NewProfileForm): Promise<ProfileRequestResult> {
  const { token } = authStorage;
  try {
    if (!token) {
      throw new Error('Unauthorized');
    }
    const result = await axios.post('http://localhost:3001/profile', profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      profile: result.data,
    };
  } catch (e) {
    return {
      success: false,
      error: 'Some error',
    };
  }
}
