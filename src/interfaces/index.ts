export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Room {
  id: number;
  title: string;
}

export interface EditUserForm {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export type EditUserFormIndex = "first_name" | "last_name" | "email";

export type UserFormIndex = EditUserFormIndex | "password";
