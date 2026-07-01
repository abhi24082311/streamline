"use server"

import { client } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { sendMail } from "@/lib/mailer"

// ---------------------------------------------------------------------------
// Email template helpers
// ---------------------------------------------------------------------------

function buildInviteEmailHtml({
  inviterName,
  workspaceName,
  inviteLink,
}: {
  inviterName: string
  workspaceName: string
  inviteLink: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Workspace Invitation</title></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border-radius:14px;overflow:hidden;border:1px solid #1D1D1D;max-width:560px;width:100%;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:32px 40px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Streamline</h1>
          <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:13px;">Async video collaboration</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <h2 style="color:#fff;font-size:20px;font-weight:600;margin:0 0 16px;">You've been invited!</h2>
          <p style="color:#9D9D9D;font-size:15px;line-height:1.7;margin:0 0 12px;">
            <strong style="color:#e5e5e5;">${inviterName}</strong> has invited you to join the workspace
            <strong style="color:#e5e5e5;">&quot;${workspaceName}&quot;</strong> on Streamline.
          </p>
          <p style="color:#9D9D9D;font-size:14px;line-height:1.6;margin:0 0 32px;">
            Click the button below to accept the invitation and start collaborating.
          </p>
          <!-- CTA -->
          <div style="text-align:center;margin-bottom:32px;">
            <a href="${inviteLink}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:600;font-size:15px;">
              Accept Invitation &rarr;
            </a>
          </div>
          <!-- Link fallback -->
          <p style="color:#555;font-size:12px;line-height:1.6;margin:0;">
            Or copy this link into your browser:<br>
            <a href="${inviteLink}" style="color:#818cf8;word-break:break-all;">${inviteLink}</a>
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="border-top:1px solid #1D1D1D;padding:16px 40px;text-align:center;">
          <p style="color:#555;font-size:12px;margin:0;">&copy; 2025 Streamline. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403 }

    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkId: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkId: user.id,
                }
              }
            }
          }
        ]
      }
    })

    return {
      status: 200, data: { workspace: isUserInWorkspace },
    }
  } catch (error) {
    return {
      status: 403,
      data: { workspace: null },
    }
  }
}

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId
      },
      include: {
        _count: {
          select: {
            videos: true,
          }
        }
      }
    })
    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders }
    }
    return { status: 404, data: [] }
  }
  catch (error) {
    return { status: 403, data: [] }
  }
}

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 404 }
    const videos = await client.video.findMany({
      where: {
        OR: [
          { workSpaceId },
          { folderId: workSpaceId }
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        WorkSpace: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    if (videos && videos.length > 0) {
      return { status: 200, data: videos }
    }
    return { status: 404 }
  } catch (error) {
    return { status: 400 }
  }
}


export const getWorkSpaces = async () => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 404 }
    const workspaces = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        subscription: { select: { plan: true } },
        workSpace: { select: { id: true, name: true, type: true } },
        members: {
          select: {
            WorkSpace: { select: { id: true, name: true } },
          },
        },
        // Fetch notifications in the same query to save a round-trip
        notification: { select: { id: true, content: true, read: true, userId: true } },
        _count: { select: { notification: true } },
      },
    })
    if (workspaces) return { status: 200, data: workspaces }
    return { status: 404 }
  } catch (error) {
    return { status: 400 }
  }
}

export const getNotifications = async () => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 404 }
    const notifications = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    })

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications }
    return { status: 404, data: [] }
  } catch (error) {
    return { status: 400, data: [] }
  }
}

export const inviteToWorkspace = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: 'Unauthorized' }

    const [sender, workspace] = await Promise.all([
      client.user.findUnique({
        where: { clerkId: user.id },
        select: { id: true, firstName: true, lastName: true },
      }),
      client.workSpace.findUnique({
        where: { id: workspaceId },
        select: { name: true },
      }),
    ])
    if (!sender) return { status: 404, data: 'Sender not found' }

    const inviterName = `${sender.firstName ?? ''} ${sender.lastName ?? ''}`.trim()
    const workspaceName = workspace?.name ?? 'a workspace'

    // Create invitation first so we get the ID
    const invitation = await client.invite.create({
      data: {
        senderId: sender.id,
        recieverId,
        workSpaceId: workspaceId,
        content: `You have been invited by ${inviterName} to join their workspace.`,
      },
    })

    if (!invitation) {
      return { status: 400, data: 'Failed to create invitation' }
    }

    const host = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000'
    const inviteLink = `${host}/invite/${invitation.id}`

    // Create notification and attempt to send email in parallel (handling email failures gracefully)
    await Promise.all([
      client.notification.create({
        data: {
          userId: recieverId,
          content: `${inviterName} invited you to "${workspaceName}"`,
        },
      }),
      (async () => {
        try {
          await sendMail({
            to: email,
            subject: `${inviterName} invited you to \"${workspaceName}\" on Streamline`,
            html: buildInviteEmailHtml({ inviterName, workspaceName, inviteLink }),
          })
        } catch (emailErr) {
          console.warn('Failed to send invite email via Gmail SMTP:', emailErr)
        }
      })()
    ])

    return {
      status: 200,
      data: 'Invitation sent successfully',
      inviteLink
    }
  } catch (error) {
    console.error(error)
    return { status: 500, data: 'Something went wrong' }
  }
}

export const getInvitationInfo = async (inviteId: string) => {
  try {
    const invite = await client.invite.findUnique({
      where: { id: inviteId },
      include: {
        sender: {
          select: { firstName: true, lastName: true, image: true, email: true }
        },
        WorkSpace: {
          select: { name: true }
        }
      }
    })
    if (!invite) return { status: 404, data: null }
    return { status: 200, data: invite }
  } catch (error) {
    console.error(error)
    return { status: 500, data: null }
  }
}

export const acceptWorkspaceInvite = async (inviteId: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: 'Unauthorized' }

    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true, email: true }
    })
    if (!dbUser) return { status: 404, data: 'User not found' }

    const invite = await client.invite.findUnique({
      where: { id: inviteId }
    })
    if (!invite) return { status: 404, data: 'Invitation not found' }
    if (invite.accepted) return { status: 200, data: 'Invitation already accepted', workspaceId: invite.workSpaceId }

    if (invite.recieverId !== dbUser.id) {
      return { status: 403, data: 'This invitation belongs to another user' }
    }

    // Add as a member of the workspace
    await client.member.create({
      data: {
        userId: dbUser.id,
        workSpaceId: invite.workSpaceId ?? '',
        member: true
      }
    })

    // Update invite status
    await client.invite.update({
      where: { id: inviteId },
      data: { accepted: true }
    })

    return { status: 200, data: 'Joined successfully', workspaceId: invite.workSpaceId }
  } catch (error) {
    console.error(error)
    return { status: 500, data: 'Something went wrong' }
  }
}

export const createFolder = async (workspaceId: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: "Unauthorized" }

    const folder = await client.folder.create({
      data: {
        workSpaceId: workspaceId,
        name: "Untitled Folder",
      },
    })

    if (folder) {
      return { status: 200, data: folder }
    }
    return { status: 400, data: "Could not create folder" }
  } catch (error) {
    console.error(error)
    return { status: 500, data: "Something went wrong" }
  }
}

export const renameFolder = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: { id: folderId },
      data: { name },
    })
    if (folder) {
      return { status: 200, data: "Folder renamed" }
    }
    return { status: 400, data: "Could not rename folder" }
  } catch (error) {
    console.error(error)
    return { status: 500, data: "Something went wrong" }
  }
}

export const deleteFolder = async (folderId: string) => {
  try {
    const folder = await client.folder.delete({
      where: { id: folderId },
    })
    if (folder) {
      return { status: 200, data: "Folder deleted" }
    }
    return { status: 400, data: "Could not delete folder" }
  } catch (error) {
    console.error(error)
    return { status: 500, data: "Something went wrong" }
  }
}

export const createWorkspace = async (name: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: "Unauthorized" }

    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    })
    if (!dbUser) return { status: 404, data: "User not found" }

    const workspace = await client.workSpace.create({
      data: {
        name,
        type: 'PUBLIC',
        userid: dbUser.id,
      },
    })

    if (workspace) {
      return { status: 200, data: workspace }
    }
    return { status: 400, data: "Could not create workspace" }
  } catch (error) {
    console.error(error)
    return { status: 500, data: "Something went wrong" }
  }
}

export const renameWorkspace = async (workspaceId: string, name: string) => {
  try {
    const workspace = await client.workSpace.update({
      where: { id: workspaceId },
      data: { name },
    })
    if (workspace) {
      return { status: 200, data: "Workspace renamed" }
    }
    return { status: 400, data: "Could not rename workspace" }
  } catch (error) {
    console.error(error)
    return { status: 500, data: "Something went wrong" }
  }
}

export const moveVideoToWorkspace = async (
  videoId: string,
  targetWorkspaceId: string
) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: 'Unauthorized' }

    // Verify the user has access to the target workspace
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        workSpace: { select: { id: true } },
        members: { select: { workSpaceId: true } },
      },
    })
    if (!dbUser) return { status: 404, data: 'User not found' }

    const ownedIds = dbUser.workSpace.map((w) => w.id)
    const memberIds = dbUser.members.map((m) => m.workSpaceId).filter(Boolean) as string[]
    const accessibleIds = [...ownedIds, ...memberIds]

    if (!accessibleIds.includes(targetWorkspaceId)) {
      return { status: 403, data: 'No access to target workspace' }
    }

    await client.video.update({
      where: { id: videoId },
      data: {
        workSpaceId: targetWorkspaceId,
        folderId: null,
      },
    })

    return { status: 200, data: 'Video moved successfully' }
  } catch (error) {
    console.error(error)
    return { status: 500, data: 'Something went wrong' }
  }
}
