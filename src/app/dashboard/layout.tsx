import React from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { DashboardHeader } from "@/components/dashboard-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex w-full overflow-auto bg-black min-h-screen">

      <DashboardHeader />

      <main className="pt-[5rem] w-full">
        {children}
      </main>
    </div>
  )
}
