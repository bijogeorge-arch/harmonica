"use client"

import { useState } from "react"
import { Plus, Trash2, Download, Building2, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useLists, CompanyList } from "@/hooks/use-lists"
import mockCompanies from "@/data/mockCompanies.json"
import Link from "next/link"

export default function ListsPage() {
    const { lists, createList, deleteList, removeCompanyFromList } = useLists()
    const [newListName, setNewListName] = useState("")
    const [selectedListId, setSelectedListId] = useState<string | null>(null)

    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault()
        if (newListName.trim()) {
            createList(newListName.trim())
            setNewListName("")
        }
    }

    const selectedList = lists.find((l) => l.id === selectedListId)
    const listCompanies = selectedList
        ? mockCompanies.filter((c) => selectedList.companyIds.includes(c.id))
        : []

    const exportList = (list: CompanyList, format: "csv" | "json") => {
        const companies = mockCompanies.filter((c) => list.companyIds.includes(c.id))
        const filename = `${list.name.replace(/\s+/g, "_")}.${format}`

        let content = ""
        let type = ""

        if (format === "json") {
            content = JSON.stringify(companies, null, 2)
            type = "application/json"
        } else {
            const headers = ["ID", "Name", "Website", "Industry", "Size", "Founded", "Last Funding"]
            const rows = companies.map(c => [
                c.id,
                c.name,
                c.websiteUrl,
                c.industry,
                c.employeeCount,
                c.foundedYear,
                c.lastFundingRound
            ])
            content = [headers, ...rows].map(e => e.join(",")).join("\n")
            type = "text/csv"
        }

        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
                    <p className="text-muted-foreground">Manage your custom company watchlists.</p>
                </div>
                <form onSubmit={handleCreateList} className="flex gap-2">
                    <Input
                        placeholder="New list name..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="w-[200px]"
                    />
                    <Button type="submit">
                        <Plus className="h-4 w-4 mr-2" />
                        Create
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-sm">My Lists</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col">
                            {lists.length === 0 && (
                                <p className="p-4 text-xs text-muted-foreground text-center">No lists created yet.</p>
                            )}
                            {lists.map((list) => (
                                <button
                                    key={list.id}
                                    onClick={() => setSelectedListId(list.id)}
                                    className={`flex items-center justify-between p-3 text-sm transition-colors hover:bg-muted ${selectedListId === list.id ? "bg-muted font-medium" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="truncate">{list.name}</span>
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                        {list.companyIds.length}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-3">
                    {selectedList ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedList.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedList.companyIds.length} companies in this list
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => exportList(selectedList, "csv")}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export CSV
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => exportList(selectedList, "json")}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export JSON
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => {
                                        if (confirm("Delete this list?")) {
                                            deleteList(selectedList.id)
                                            setSelectedListId(null)
                                        }
                                    }}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete List
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {listCompanies.length === 0 && (
                                    <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center">
                                        <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                                        <p className="text-muted-foreground">No companies in this list yet.</p>
                                        <Link href="/companies">
                                            <Button variant="link">Browse Companies</Button>
                                        </Link>
                                    </Card>
                                )}
                                {listCompanies.map((company) => (
                                    <Card key={company.id} className="group hover:border-primary/50 transition-colors">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {company.name[0]}
                                                </div>
                                                <div>
                                                    <Link
                                                        href={`/companies/${company.id}`}
                                                        className="font-semibold hover:underline flex items-center gap-1"
                                                    >
                                                        {company.name}
                                                        <ChevronRight className="h-3 w-3" />
                                                    </Link>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-xs text-muted-foreground">{company.industry}</span>
                                                        <span className="text-xs text-muted-foreground">•</span>
                                                        <span className="text-xs text-muted-foreground">{company.employeeCount} employees</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeCompanyFromList(selectedList.id, company.id)}
                                            >
                                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card className="h-full border-dashed flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <Plus className="h-12 w-12 mb-4 opacity-20" />
                            <p>Select a list from the left or create a new one to get started.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
