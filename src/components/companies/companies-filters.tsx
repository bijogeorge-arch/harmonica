"use client"

import { Bookmark, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface CompaniesFiltersProps {
    industries: string[]
    selectedIndustry: string | null
    onIndustryChange: (industry: string | null) => void
    selectedEmployeeRange: string | null
    onEmployeeRangeChange: (range: string | null) => void
    searchQuery?: string | null
    onSearchQueryChange?: (query: string | null) => void
    onSaveSearch?: () => void
}

const employeeRanges = [
    { label: "1-10", value: "0-10" },
    { label: "11-50", value: "11-50" },
    { label: "51-200", value: "51-200" },
    { label: "201-500", value: "201-500" },
    { label: "500+", value: "501-10000" },
]

export function CompaniesFilters({
    industries,
    selectedIndustry,
    onIndustryChange,
    selectedEmployeeRange,
    onEmployeeRangeChange,
    searchQuery,
    onSearchQueryChange,
    onSaveSearch,
}: CompaniesFiltersProps) {
    const hasFilters = selectedIndustry || selectedEmployeeRange || searchQuery

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters</span>
            </div>

            <Select
                value={selectedIndustry || "all"}
                onValueChange={(v) => onIndustryChange(v === "all" ? null : v)}
            >
                <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                            {ind}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedEmployeeRange || "all"}
                onValueChange={(v) => onEmployeeRangeChange(v === "all" ? null : v)}
            >
                <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Employee Count" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {employeeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                            {range.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {hasFilters && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onIndustryChange(null)
                            onEmployeeRangeChange(null)
                            onSearchQueryChange?.(null)
                        }}
                        className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onSaveSearch}
                        className="h-8"
                    >
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save Search
                    </Button>
                </div>
            )}

            <div className="flex-1" />

            <div className="flex items-center gap-2">
                {searchQuery && (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal bg-primary/10 text-primary border-primary/20">
                        Search: &quot;{searchQuery}&quot;
                    </Badge>
                )}
                {selectedIndustry && (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                        Industry: {selectedIndustry}
                    </Badge>
                )}
                {selectedEmployeeRange && (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                        Size: {employeeRanges.find((r) => r.value === selectedEmployeeRange)?.label}
                    </Badge>
                )}
            </div>
        </div>
    )
}
