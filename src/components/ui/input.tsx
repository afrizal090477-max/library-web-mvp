import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-[12px] border border-[#D5D7DA] bg-white px-4 py-3 text-base text-[#0A0D12] transition-colors outline-none",
        "placeholder:text-[#6B7280] placeholder:font-normal",
        "focus-visible:border-[#1C65DA] focus-visible:ring-2 focus-visible:ring-[#1C65DA]/20",
        "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:opacity-60",
        "aria-invalid:border-[#EE1D52] aria-invalid:ring-2 aria-invalid:ring-[#EE1D52]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }