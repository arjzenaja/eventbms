"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const ModernSelect = SelectPrimitive.Root

const ModernSelectGroup = SelectPrimitive.Group

const ModernSelectValue = SelectPrimitive.Value

const ModernSelectTrigger = React.forwardRef(({ className, children, icon, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-lg border border-gray-200/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
      className
    )}
    {...props}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="text-blue-400">
          {icon}
        </div>
      )}
      {children}
    </div>
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-white opacity-70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
ModernSelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const ModernSelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200/30 bg-white/95 backdrop-blur-md text-gray-900 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}>
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
ModernSelectContent.displayName = SelectPrimitive.Content.displayName

const ModernSelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-gray-700", className)}
    {...props} />
))
ModernSelectLabel.displayName = SelectPrimitive.Label.displayName

const ModernSelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none focus:bg-blue-50 focus:text-blue-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors duration-150",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-blue-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
ModernSelectItem.displayName = SelectPrimitive.Item.displayName

const ModernSelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
    {...props} />
))
ModernSelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  ModernSelect,
  ModernSelectGroup,
  ModernSelectValue,
  ModernSelectTrigger,
  ModernSelectContent,
  ModernSelectLabel,
  ModernSelectItem,
  ModernSelectSeparator,
}
