"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3"
    >
      {theme === "dark" ? (
        <>
           <span className="mr-2">☀️</span> Light
        </>
      ) : (
        <>
            <span className="mr-2">🌙</span> Dark
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
