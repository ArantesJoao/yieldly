"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BanknoteArrowUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DepositForm from "./depositForm"

interface DepositButtonProps {
  accountId: string
  label: string
  currentBalanceMinor: number
}

export default function DepositButton({ accountId, label, currentBalanceMinor }: DepositButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDialog}
        className="bg-white/10 border-white/20 text-linen-50 hover:bg-white/20 hover:text-white backdrop-blur-sm h-full flex flex-col gap-1"
        aria-label={`Make deposit to ${label}`}
      >
        <BanknoteArrowUp className="w-4 h-4" />
        Deposit
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="backdrop-blur-2xl bg-background/90 border-border/50">
          <DialogHeader>
            <DialogTitle>Deposit to {label}</DialogTitle>
          </DialogHeader>
          <DepositForm
            accountId={accountId}
            currentBalanceMinor={currentBalanceMinor}
            toggleDialog={toggleDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
