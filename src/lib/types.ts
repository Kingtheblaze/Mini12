export interface User {
    id: number;
    name: string;
    email: string;
    department?: string | null;
    year?: number | null;
    timeCredits: number;
    rating?: string | null;
    totalSessions: number;
    bio?: string | null;
}

export interface Skill {
    id: number;
    name: string;
    type: "HAVE" | "NEED";
    category: string;
    userId: number;
    user?: Partial<User> | null;
}

export interface SwapRequest {
    id: number;
    status: "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED";
    creditsAmt: number;
    requesterId: number;
    receiverId: number;
    requester: Partial<User>;
    receiver: Partial<User>;
    createdAt: Date;
}
