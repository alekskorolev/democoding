export function usernameValid(username: string) {
  return username && username.length > 3;
}

export function passwordValid(password: string) {
  return password && password.length > 3;
}
