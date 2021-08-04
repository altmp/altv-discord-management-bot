export interface IMutedUser {
    userName: string;
    userId: string;
    mutedByName: string;
    mutedById: string;
    reason?: number;
    until?: number;
}