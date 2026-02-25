"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { ArrowLeft, ExternalLink, Plus, Save, Info, MessageSquare, Briefcase, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotes } from "@/hooks/use-notes"
import { useLists } from "@/hooks/use-lists"
import mockCompanies from "@/data/mockCompanies.json"
import { Company, EnrichedData } from "@/types/company"
import { Loader2, Sparkles, CheckCircle2, History } from "lucide-react"

export default function CompanyProfilePage() {
    const params = useParams()
    const router = useRouter()
    const companyId = params.id as string
    const [company, setCompany] = useState<Company | null>(null)

    const { getNote, updateNote } = useNotes()
    const { lists, addCompanyToList, createList, isCompanyInList } = useLists()
    const [localNote, setLocalNote] = useState("")
    const [enrichedData, setEnrichedData] = useState<EnrichedData | null>(null)
    const [isEnriching, setIsEnriching] = useState(false)
    const [saveFeedback, setSaveFeedback] = useState<string | null>(null)

    const handleAddToList = (listId: string, listName: string) => {
        addCompanyToList(listId, companyId)
        setSaveFeedback(`Added to ${listName}`)
        setTimeout(() => setSaveFeedback(null), 3000)
    }

    useEffect(() => {
        const found = mockCompanies.find((c) => c.id === companyId) as Company | undefined
        if (found) {
            setCompany(found)
            setLocalNote(getNote(companyId))

            // Load cached enrichment data
            const cached = localStorage.getItem(`enriched_${companyId}`)
            if (cached) {
                try {
                    setEnrichedData(JSON.parse(cached))
                } catch (e) {
                    console.error("Failed to parse cached enrichment data", e)
                }
            }
        }
    }, [companyId, getNote])

    const handleEnrich = useCallback(async () => {
        if (!company || isEnriching) return

        setIsEnriching(true)
        try {
            const response = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: company.websiteUrl })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to enrich company data")
            }

            setEnrichedData(data)
            localStorage.setItem(`enriched_${companyId}`, JSON.stringify(data))
        } catch (error) {
            console.error("Enrichment error:", error)
            alert(error instanceof Error ? error.message : "An unexpected error occurred during enrichment")
        } finally {
            setIsEnriching(false)
        }
    }, [company, isEnriching, companyId])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if not in an input/textarea
            const activeElement = document.activeElement;
            const isInput = activeElement && ["INPUT", "TEXTAREA"].includes(activeElement.tagName);

            if (e.key === "Escape") {
                router.back();
            } else if (e.key.toLowerCase() === "e" && !isInput) {
                handleEnrich();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router, handleEnrich]);

    const handleSaveNote = () => {
        updateNote(companyId, localNote)
    }

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading company profile...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
            {saveFeedback && (
                <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <Badge className="bg-green-600 text-white px-4 py-2 shadow-lg flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {saveFeedback}
                    </Badge>
                </div>
            )}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Save to List
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Lists</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {lists.length === 0 && (
                                <div className="p-2 text-xs text-muted-foreground text-center italic">
                                    No lists created yet
                                </div>
                            )}
                            {lists.map((list) => {
                                const inList = isCompanyInList(list.id, company.id)
                                return (
                                    <DropdownMenuItem
                                        key={list.id}
                                        onClick={() => handleAddToList(list.id, list.name)}
                                        className="flex items-center justify-between"
                                    >
                                        {list.name}
                                        {inList && <CheckCircle2 className="h-3 w-3 text-green-600 fill-green-500/10" />}
                                    </DropdownMenuItem>
                                )
                            })}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                const name = prompt("Enter list name:")
                                if (name) {
                                    const newList = createList(name)
                                    handleAddToList(newList.id, name)
                                }
                            }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create New List
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="default"
                        onClick={handleEnrich}
                        disabled={isEnriching}
                        className="bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 group relative"
                    >
                        {isEnriching ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                        )}
                        {enrichedData ? "Refresh Insight" : "Live Enrichment"}
                        <span className="hidden md:inline-flex ml-2 items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-primary-foreground/20 rounded opacity-50">E</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>Company details and core mission</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                {company.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Industry</p>
                                    <Badge variant="secondary">{company.industry}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Website</p>
                                    <a
                                        href={company.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary flex items-center gap-1 hover:underline"
                                    >
                                        {company.websiteUrl} <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Founded</p>
                                    <p className="text-sm">{company.foundedYear}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Employee Count</p>
                                    <p className="text-sm">{company.employeeCount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Last Funding</p>
                                    <p className="text-sm">{company.lastFundingRound}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isEnriching && (
                        <Card className="border-primary/20 bg-primary/5 animate-pulse shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 animate-bounce" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">AI Analysis in Progress...</CardTitle>
                                        <CardDescription>Scraping {company.websiteUrl} and matching against Fund Thesis</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
                                    <div className="flex-1 space-y-3 pt-2">
                                        <div className="h-4 bg-muted rounded w-3/4" />
                                        <div className="h-3 bg-muted rounded w-full" />
                                        <div className="h-3 bg-muted rounded w-5/6" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-primary/20">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                            <div className="h-3 bg-muted rounded w-full" />
                                            <div className="h-3 bg-muted rounded w-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                            <div className="flex flex-wrap gap-2">
                                                <div className="h-5 w-12 bg-muted rounded-full" />
                                                <div className="h-5 w-16 bg-muted rounded-full" />
                                                <div className="h-5 w-14 bg-muted rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {enrichedData && !isEnriching && (
                        <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 shadow-md overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <Sparkles className="h-32 w-32 text-primary" />
                            </div>

                            <div className="absolute top-6 right-6">
                                <div className={`flex flex-col items-center justify-center h-20 w-20 rounded-full border-4 ${enrichedData.thesisMatchScore >= 80 ? 'border-green-500/50 bg-green-50' :
                                    enrichedData.thesisMatchScore >= 50 ? 'border-amber-500/50 bg-amber-50' :
                                        'border-red-500/50 bg-red-50'
                                    } shadow-inner animate-in zoom-in duration-500`}>
                                    <span className={`text-2xl font-black ${enrichedData.thesisMatchScore >= 80 ? 'text-green-700' :
                                        enrichedData.thesisMatchScore >= 50 ? 'text-amber-700' :
                                            'text-red-700'
                                        }`}>
                                        {enrichedData.thesisMatchScore}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground/70">Score</span>
                                </div>
                            </div>

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary text-xl">
                                    <Sparkles className="h-5 w-5" />
                                    Thesis Match Engine
                                </CardTitle>
                                <CardDescription>Intelligent analysis against your investment criteria</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <section className="max-w-[75%] space-y-3 relative z-10 transition-all duration-300">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] px-2 py-0 uppercase tracking-wider font-bold">
                                            Match Intelligence
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-foreground">
                                        {enrichedData.matchExplanation}
                                    </p>
                                    <p className="text-sm leading-relaxed text-muted-foreground italic border-l-2 border-primary/20 pl-4 py-1">
                                        &quot;{enrichedData.summary}&quot;
                                    </p>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                            Product & Capabilities
                                        </h4>
                                        <ul className="space-y-2.5">
                                            {(enrichedData.whatTheyDo || []).map((point, i) => (
                                                <li key={i} className="text-sm flex gap-3 text-muted-foreground/90 group/item">
                                                    <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors shrink-0" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                                            <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                                            Market Context
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(enrichedData.keywords || []).map((keyword, i) => (
                                                <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-transparent hover:bg-primary/10 transition-colors">
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="opacity-50" />

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2 text-muted-foreground/60 transition-colors hover:text-muted-foreground">
                                        <History className="h-3.5 w-3.5" />
                                        <span>Verified on {new Date(enrichedData.sources[0]?.timestamp).toLocaleDateString()} at {new Date(enrichedData.sources[0]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(enrichedData.signals || []).map((signal, i) => (
                                            <span key={i} className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 font-semibold text-[10px] uppercase tracking-tighter">
                                                {signal}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}


                    <Tabs defaultValue="timeline" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="timeline">Signals Timeline</TabsTrigger>
                            <TabsTrigger value="hiring">Hiring & Growth</TabsTrigger>
                        </TabsList>
                        <TabsContent value="timeline" className="mt-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        {[
                                            { date: "Oct 2025", event: "Series A funding raised", icon: TrendingUp, detail: "Closed $12M led by Sequoia Capital" },
                                            { date: "Aug 2025", event: "Featured in TechCrunch", icon: Info, detail: `Article on disruptive approach to ${company.industry}` },
                                            { date: "Jun 2025", event: "Key hire: VP of Engineering", icon: Briefcase, detail: "Formerly at Google Cloud" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <item.icon className="h-4 w-4 text-primary" />
                                                    </div>
                                                    {i < 2 && <div className="w-px h-full bg-border my-1" />}
                                                </div>
                                                <div className="pb-4">
                                                    <p className="text-sm font-semibold">{item.event}</p>
                                                    <p className="text-xs text-muted-foreground mb-1">{item.date}</p>
                                                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="hiring" className="mt-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground mb-4">Current open positions</p>
                                    <div className="space-y-3">
                                        {["Senior Product Designer", "Full Stack Engineer", "Head of Sales"].map((role, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                                                <span className="text-sm font-medium">{role}</span>
                                                <Badge variant="outline">Full-time</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Notes
                            </CardTitle>
                            <CardDescription>Private thoughts and analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Add your notes here..."
                                className="min-h-[200px]"
                                value={localNote}
                                onChange={(e) => setLocalNote(e.target.value)}
                            />
                            <Button className="w-full" onClick={handleSaveNote}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Note
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Recent Signals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                High hiring intent detected
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-center gap-6 mt-12 pb-12 border-t pt-8">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <kbd className="px-1.5 py-0.5 rounded border bg-muted font-sans font-medium">Esc</kbd>
                    <span>to go back</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <kbd className="px-1.5 py-0.5 rounded border bg-muted font-sans font-medium">E</kbd>
                    <span>to enrich</span>
                </div>
            </div>
        </div>
    )
}

