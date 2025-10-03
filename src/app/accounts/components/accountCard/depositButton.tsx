"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BanknoteArrowUp } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import DepositForm from "./depositForm"

interface DepositButtonProps {
  accountId: string
  label: string
  currentBalanceMinor: number
}

export default function DepositButton({ accountId, label, currentBalanceMinor }: DepositButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleOpen}
        className="bg-white/10 border-white/20 text-linen-50 hover:bg-white/20 hover:text-white backdrop-blur-sm h-full flex flex-col gap-1"
        aria-label={`Make deposit to ${label}`}
      >
        <BanknoteArrowUp className="w-4 h-4" />
        Deposit
      </Button>

      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="backdrop-blur-2xl bg-background/90 border-border/50">
            <DialogHeader>
              <DialogTitle>Deposit to {label}</DialogTitle>
            </DialogHeader>
            <DepositForm
              accountId={accountId}
              currentBalanceMinor={currentBalanceMinor}
              toggleDialog={toggleOpen}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Deposit to {label}</DrawerTitle>
            </DrawerHeader>
            <DepositForm
              accountId={accountId}
              currentBalanceMinor={currentBalanceMinor}
              toggleDialog={toggleOpen}
              className="px-4"
            />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
