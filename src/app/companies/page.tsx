"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CompaniesTable } from "@/components/companies/companies-table"
import { CompaniesFilters } from "@/components/companies/companies-filters"
import mockCompanies from "@/data/mockCompanies.json"
import { Company } from "@/types/company"
import { useSavedSearches } from "@/hooks/use-saved-searches"

export default function CompaniesPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { saveSearch } = useSavedSearches()

    const [selectedIndustry, setSelectedIndustry] = React.useState<string | null>(
        searchParams.get("industry")
    )
    const [selectedEmployeeRange, setSelectedEmployeeRange] = React.useState<string | null>(
        searchParams.get("range")
    )
    const [searchQuery, setSearchQuery] = React.useState<string | null>(
        searchParams.get("q")
    )

    React.useEffect(() => {
        setSelectedIndustry(searchParams.get("industry"))
        setSelectedEmployeeRange(searchParams.get("range"))
        setSearchQuery(searchParams.get("q"))
    }, [searchParams])

    const companies: Company[] = mockCompanies as Company[]

    const industries = React.useMemo(() => {
        return Array.from(new Set(companies.map((c) => c.industry))).sort()
    }, [companies])

    const filteredCompanies = React.useMemo(() => {
        return companies.filter((company) => {
            // Text search
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchesName = company.name.toLowerCase().includes(query)
                const matchesDesc = company.description.toLowerCase().includes(query)
                if (!matchesName && !matchesDesc) return false
            }

            // Industry filter
            if (selectedIndustry && company.industry !== selectedIndustry) {
                return false
            }

            // Employee range filter
            if (selectedEmployeeRange) {
                const [min, max] = selectedEmployeeRange.split("-").map(Number)
                if (company.employeeCount < min || company.employeeCount > (max || 100000)) {
                    return false
                }
            }

            return true
        })
    }, [companies, selectedIndustry, selectedEmployeeRange, searchQuery])

    const handleSaveSearch = () => {
        const name = prompt("Enter a name for this search:")
        if (name) {
            saveSearch(name, "", {
                industry: selectedIndustry,
                employeeRange: selectedEmployeeRange
            })
            alert("Search saved!")
        }
    }

    const handleClearSearch = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("q")
        router.push(`/companies?${params.toString()}`)
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
                <p className="text-muted-foreground">
                    Discover and filter target companies for your investment pipeline.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <CompaniesFilters
                    industries={industries}
                    selectedIndustry={selectedIndustry}
                    onIndustryChange={setSelectedIndustry}
                    selectedEmployeeRange={selectedEmployeeRange}
                    onEmployeeRangeChange={setSelectedEmployeeRange}
                    searchQuery={searchQuery}
                    onSearchQueryChange={handleClearSearch}
                    onSaveSearch={handleSaveSearch}
                />

                <CompaniesTable data={filteredCompanies} />
            </div>
        </div>
    )
}
