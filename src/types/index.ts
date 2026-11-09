export type Priority = 'low' | 'medium' | 'high';
export type Status = 'backlog' | 'todo' | 'in_progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    dueDate: string;
    assignee?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    image?: string;
}

export interface UserResponse extends UserProfile {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}


export interface UserResponse extends UserProfile {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}