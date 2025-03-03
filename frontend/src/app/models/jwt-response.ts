export interface JwtResponse {
  token: string;
  username: string;
  role: string;
  userId: number; // Add this field
}