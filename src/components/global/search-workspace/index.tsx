import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutationData } from "@/hooks/useMutationData"
import React from "react"
import { useSearch } from "@/hooks/useSearch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Loader from "@/components/global/loader"
import { User } from "lucide-react"
import { inviteToWorkspace } from "@/actions/workspace"
import { toast } from "sonner"

type Props = {
    workspaceId: string
}

const Search = ({ workspaceId }: Props) => {
    const { onSearchQuery, query, isFetching, onUsers } = useSearch(
        'get-users',
        'WORKSPACE'
    )

    const { mutate, isPending } = useMutationData(
        ['invite-member'],
        (data: { recieverId: string; email: string }) =>
            inviteToWorkspace(workspaceId, data.recieverId, data.email),
        (data) => {
            if (data?.status === 200 && data?.inviteLink) {
                if (typeof window !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(data.inviteLink)
                        .then(() => {
                            toast.success("Invite link copied to clipboard!")
                        })
                        .catch((err) => {
                            console.warn("Clipboard copy failed:", err)
                            toast.success(`Invite created! Copy: ${data.inviteLink}`, {
                                duration: 10000,
                            })
                        })
                } else {
                    toast.success(`Invite created! Copy: ${data.inviteLink}`, {
                        duration: 10000,
                    })
                }
            }
        },
        'user-notifications'
    )

    return (
        <div className="flex flex-col gap-y-5">
            <Input
                placeholder="search for your user..."
                className="bg-transparent border-2 outline-none"
                value={query}
                onChange={onSearchQuery}
                type="text"
            />
            {isFetching ? (
                <div className="flex flex-col gap-y-2">
                    <Skeleton className="w-full h-8 rounded-xl" />
                </div>
            ) : !onUsers ? (
                <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
            ) : (
                <div className="flex flex-col gap-y-3">
                    {onUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl"
                        >
                            <Avatar>
                                <AvatarImage src={user.image as string} />
                                <AvatarFallback>
                                    <User className="w-4 h-4 text-neutral-400" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <h3 className="text-bold text-sm capitalize">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                                    {user.subscription?.[0]?.plan || 'FREE'}
                                </p>
                            </div>
                            <div className="flex-1 flex justify-end items-center">
                                <Button
                                    onClick={() => mutate({ recieverId: user.id, email: user.email as string })}
                                    variant="default"
                                    className="w-5/12 font-bold bg-indigo-600 hover:bg-indigo-600/90 text-white rounded-xl"
                                >
                                    <Loader
                                        state={isPending}
                                        color="#000"
                                    >
                                        Invite
                                    </Loader>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Search
