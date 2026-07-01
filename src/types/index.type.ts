export type WorkspaceProps = {
  data: {
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
    notification: {
      id: string
      content: string
      userId: string | null
    }[]
    _count: {
      notification: number
    }
  }
}

export type FolderProps = {
  status: number
  data: {
    id: string
    name: string | null
    _count: {
      videos: number
    }
  }[]
}

export type VideosProps = {
  status: number
  data: {
    id: string
    title: string | null
    createdAt: Date
    source: string
    processing: boolean
    Folder: { id: string; name: string | null } | null
    WorkSpace: { id: string; name: string } | null
    User: { firstName: string | null; lastName: string | null; image: string | null } | null
  }[]
}