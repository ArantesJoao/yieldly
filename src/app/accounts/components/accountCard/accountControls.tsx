"use client"

import { useState } from 'react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useIsMutating } from '@tanstack/react-query'
import { useMediaQuery } from "@/hooks/use-media-query"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
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
  const isDesktop = useMediaQuery("(min-width: 768px)")

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

      {isDesktop ? (
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>
                Update your account information
              </DialogDescription>
            </DialogHeader>
            <EditAccountForm account={account} onClose={() => setShowEdit(false)} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={showEdit} onOpenChange={setShowEdit}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit Account</DrawerTitle>
              <DrawerDescription>
                Update your account information
              </DrawerDescription>
            </DrawerHeader>
            <EditAccountForm account={account} onClose={() => setShowEdit(false)} className="px-4" />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

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

