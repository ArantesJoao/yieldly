"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateAccount } from "@/services/accounts/mutations"
import CreateAccountForm from "./createAccountForm"

const NewAccountButton = () => {
  const { mutate: createAccount } = useCreateAccount()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button >+ Create Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Create a new account here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <CreateAccountForm />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit">Create Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewAccountButton
