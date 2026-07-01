import { MutationFunction, MutationKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useMutationData = (
    mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    onSuccess?: (data: any) => void,
    queryKey?: string,
) => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationKey,
        mutationFn,
        // Optimistic update: snapshot then clear cache immediately so UI responds instantly
        onMutate: async () => {
            if (!queryKey) return
            // Cancel any in-flight refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: [queryKey] })
            // Snapshot previous value for rollback
            const previous = queryClient.getQueryData([queryKey])
            return { previous }
        },
        onSuccess(data) {
            if (onSuccess) onSuccess(data)
            toast(data?.status === 200 || data?.status === 201 ? 'Success' : 'Error', {
                description: data?.data,
            })
        },
        onError: (_err, _vars, context: any) => {
            // Roll back on error
            if (queryKey && context?.previous !== undefined) {
                queryClient.setQueryData([queryKey], context.previous)
            }
            toast('Error', { description: 'Something went wrong. Please try again.' })
        },
        onSettled: async () => {
            // Refetch in the background to sync real server state
            if (queryKey) {
                await queryClient.invalidateQueries({ queryKey: [queryKey] })
            }
        },
    })

    return { mutate, isPending }
}
