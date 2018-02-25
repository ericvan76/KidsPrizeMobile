import { Profile } from 'src/api/auth';
import { Child, ChildId, Redeem, WeekId, WeeklyScore } from 'src/api/child';

export interface AppState {
  auth: AuthState;
  children: Record<ChildId, ChildState>;
  currentChild: ChildId | null;
  requestState: RequestState;
}

export interface RequestState {
  requesting: Record<string, boolean | undefined>;
  errors: Record<string, Error>;
}
export interface AuthState {
  profile: Profile | undefined;
}

export interface ChildState {
  child: Child;
  scores: Record<WeekId, WeeklyScore>;
  redeems: Record<string, Redeem>;
}

export interface AuthConfig {
  auth0_domain: string;
  client_id: string;
  client_secret: string;
}

export interface ApiConfig {
  baseUrl: string;
}

export interface Config {
  auth: AuthConfig;
  api: ApiConfig;
}
