import bcrypt from 'bcrypt';

export function isPasswordMatch(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function isTokenMatch(
  token: string,
  hashedToken: string,
): Promise<boolean> {
  return bcrypt.compare(token, hashedToken);
}

export function hashing(data: string, saltRounds = 10): Promise<string> {
  return bcrypt.hash(data, saltRounds);
}
