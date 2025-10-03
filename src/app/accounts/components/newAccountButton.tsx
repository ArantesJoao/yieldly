"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import CreateAccountForm from "./createAccountForm"

const NewAccountButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      trigger={<Button className="w-full max-w-3xs">+ Create Account</Button>}
      title="Create Account"
      description="Create a new account to track your investments"
    >
      <CreateAccountForm onClose={() => setOpen(false)} />
    </ResponsiveModal>
  )
}

export default NewAccountButton
