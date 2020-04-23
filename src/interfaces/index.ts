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

export interface Player {
  id: number;
  user: User;
  status: string;
  pending_action: string;
  public_role: string;
  conversation_id: number;
  secret_special_role?: string;
}

export interface Message {
  id: number;
  text: string;
  name: string;
  api_user_id: number;
  conference_id: number;
}

export interface Room {
  id: number;
  title: string;
  players_joined: number;
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
