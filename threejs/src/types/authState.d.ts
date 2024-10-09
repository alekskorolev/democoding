import { LoginForm } from './loginForm';

export interface AuthState {
    loginForm: LoginForm,
    user?: string,
    formError?: string,
}
