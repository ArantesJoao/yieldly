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
import { useEffect, useRef } from "react"

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
  const formContainerRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    if (isDesktop) return;
    const handleResize = () => {
      if (formContainerRef.current) {
        formContainerRef.current.style.setProperty('bottom', `env(safe-area-inset-bottom)`);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

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
      <DrawerContent ref={formContainerRef} className="min-h-[70vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className={cn("px-4", contentClassName)}>
          {children}
          {!hideCancel && (
            <DrawerClose asChild className="w-full mt-2">
              <Button variant="outline">{t('buttons.cancel')}</Button>
            </DrawerClose>
          )}
        </div>

      </DrawerContent>
    </Drawer>
  )
}

