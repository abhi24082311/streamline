import { useMutation, useQueryClient, MutationKey, MutationFunction } from "@tanstack/react-query"
import { toast } from "sonner"

export const useMutationData = (
    mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    onSuccess: () => void,
    queryKey?: string,

) => {
    const client = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationKey,
        mutationFn,
        onSuccess(data) {
            if (onSuccess) onSuccess()
            return toast(data?.status === 200 ? 'Success' : 'Error', {
                description: data?.data
            })
        },
        onSettled: async () => {
            return await client.invalidateQueries({ queryKey: [queryKey] })
        }
    })

    return { mutate, isPending }
}

