export type Role = 'admin' | 'moderator' | 'business-org' | 'student' | 'regular';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}
