"use client"

import { useRouter } from "next/navigation"
import { Bookmark, Play, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSavedSearches, SavedSearch } from "@/hooks/use-saved-searches"
import { formatDistanceToNow } from "date-fns"

export default function SavedSearchesPage() {
    const { savedSearches, deleteSearch } = useSavedSearches()
    const router = useRouter()

    const applySearch = (search: SavedSearch) => {
        const params = new URLSearchParams()
        if (search.filters.industry) params.set("industry", search.filters.industry)
        if (search.filters.employeeRange) params.set("range", search.filters.employeeRange)
        router.push(`/companies?${params.toString()}`)
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Saved Searches</h1>
                <p className="text-muted-foreground">Quickly re-run your favorite filters and queries.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {savedSearches.length === 0 && (
                    <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center">
                        <Bookmark className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground mb-4">You haven&apos;t saved any searches yet.</p>
                        <Button onClick={() => router.push("/companies")}>
                            Explore Companies
                        </Button>
                    </Card>
                )}

                {savedSearches.map((search) => (
                    <Card key={search.id} className="group hover:border-primary/50 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{search.name}</h3>
                                    <Badge variant="outline" className="text-xs">
                                        {formatDistanceToNow(search.createdAt)} ago
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Filter className="h-3 w-3" />
                                        {search.filters.industry || "All Industries"}
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Search className="h-3 w-3" />
                                        {search.filters.employeeRange ? `Size: ${search.filters.employeeRange}` : "All Sizes"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => applySearch(search)}
                                >
                                    <Play className="h-4 w-4 mr-2 fill-current" />
                                    Run Search
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteSearch(search.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
