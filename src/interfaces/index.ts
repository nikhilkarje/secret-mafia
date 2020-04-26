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
  user_id: number;
  conversation_id: number;
  name: String;
  status: string;
  pending_action: string;
  public_role: string;
  secret_special_role?: string;
}

export interface Message {
  id: number;
  text: string;
  name: string;
  user_id: number;
  conference_id: number;
}

export interface Room {
  id: number;
  title: string;
  players_joined: number;
  total_players: number;
  election_tracker: number;
  draw_pile: number;
  discard_pile: number;
  liberal_policy: number;
  facist_policy: number;
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
