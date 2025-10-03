"use client"

import { useState } from 'react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useIsMutating } from '@tanstack/react-query'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { useDeleteAccount } from '@/services/accounts/mutations'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Account } from '@/types/api'
import EditAccountForm from './editAccountForm'

interface AccountControlsProps {
  account: Account
}

const AccountControls = ({ account }: AccountControlsProps) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { mutateAsync: deleteAccount } = useDeleteAccount()
  const isDeletingAccount = useIsMutating({ mutationKey: ['deleteAccount'] }) > 0

  const handleDelete = async () => {
    await deleteAccount(account.id, {
      onSuccess: () => {
        setShowDeleteDialog(false)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 items-end text-linen-50 hover:bg-white/20"
            aria-label="Account options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveModal
        open={showEdit}
        onOpenChange={setShowEdit}
        title="Edit Account"
        description="Update your account information"
      >
        <EditAccountForm account={account} onClose={() => setShowEdit(false)} />
      </ResponsiveModal>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{account.label}</strong>? This action cannot be undone and will delete all associated ledger entries and summaries.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletingAccount}
              className="w-full mb-2"
            >
              {isDeletingAccount ? <Spinner /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AccountControls

