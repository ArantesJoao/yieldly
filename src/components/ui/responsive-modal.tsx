"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"

import { useMediaQuery } from "@/hooks/use-media-query"
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface ResponsiveModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  hideCancel?: boolean
  dialogClassName?: string
  contentClassName?: string
}

export function ResponsiveModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  hideCancel = false,
  dialogClassName,
  contentClassName,
}: ResponsiveModalProps) {
  const { t } = useTranslation('common')
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className={cn("sm:max-w-[425px]", dialogClassName)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
          {!hideCancel && (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('buttons.cancel')}</Button>
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className={cn("px-4", contentClassName)}>{children}</div>
        {!hideCancel && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t('buttons.cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

