import { useQuery } from "@tanstack/react-query";

export const useAiModels = () => {
    return useQuery({
        queryKey: ['available-models'],
        queryFn: async () => {
            const response = await fetch('/api/ai/models/available');
            if (!response.ok) throw new Error('Failed to fetch models');
            const data = await response.json();
            return data.models || [];
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}