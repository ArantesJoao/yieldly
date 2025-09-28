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

const NewAccountButton = () => {
  const { mutate: createAccount } = useCreateAccount()

  return (
    <Dialog>
      <form>
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
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Account Name</Label>
              <Input id="name-1" name="name" defaultValue="Nubank" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Account Type</Label>
              <Input id="username-1" name="username" defaultValue="Checking" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit">Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default NewAccountButton
