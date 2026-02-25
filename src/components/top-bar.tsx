"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

function TopBarContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const paramQuery = searchParams.get("q") || ""
    const [query, setQuery] = useState(paramQuery)
    const [prevParamQuery, setPrevParamQuery] = useState(paramQuery)

    if (paramQuery !== prevParamQuery) {
        setPrevParamQuery(paramQuery)
        setQuery(paramQuery)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/companies?q=${encodeURIComponent(query.trim())}`)
        } else {
            router.push("/companies")
        }
    }

    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1 max-w-2xl">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search companies, people, or lists..."
                        className="w-full bg-muted/50 pl-9 focus-visible:bg-background transition-colors"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </div>
        </header>
    )
}

export function TopBar() {
    return (
        <Suspense fallback={
            <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 sticky top-0 bg-background/95 backdrop-blur z-10">
                <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex-1 max-w-2xl">
                    <div className="h-9 bg-muted/50 rounded animate-pulse" />
                </div>
            </header>
        }>
            <TopBarContent />
        </Suspense>
    )
}
