export interface UserListItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Message {
  id: number;
  text: string;
  conference_id: number;
  user: User;
}

export interface Room {
  id: number;
  title: string;
  total_players: number;
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
