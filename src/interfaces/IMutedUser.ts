export interface IMutedUser {
    userId: string;
    mutedById: string;
    reason?: string;
    until?: number;
}