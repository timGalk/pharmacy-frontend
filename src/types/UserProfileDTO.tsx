export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  email: string;
  phoneNumber: string;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  email: string;
  phoneNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 