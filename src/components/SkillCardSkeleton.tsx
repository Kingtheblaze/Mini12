import { Skeleton } from "./ui/skeleton";

export const SkillCardSkeleton = () => {
    return (
        <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
        </div>
    );
};
