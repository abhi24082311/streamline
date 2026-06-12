export type WorkspaceProps = {
    data: {
        subscription:{
            plan: 'FREE' | 'PRO'
        }[] | null
        workSpace: {
            id: string
            name: string
            type: 'PUBLIC' | 'PERSONAL'
        }[]
        members: {
            WorkSpace: {
                id: string
                name: string
            } | null
        }[]
    }
}

export type NotificationProps = {
  status: number
  data: {
    _count: {
      notification: number
    }
  }
}