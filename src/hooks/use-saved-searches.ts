"use client"

import { useLocalStorage } from "./use-local-storage"
import { useCallback } from "react"

export interface SavedSearch {
    id: string
    name: string
    query: string
    filters: {
        industry: string | null
        employeeRange: string | null
    }
    createdAt: number
}

export function useSavedSearches() {
    const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>("harmonic-saved-searches", [])

    const saveSearch = useCallback((name: string, query: string, filters: SavedSearch["filters"]) => {
        const newSearch: SavedSearch = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            query,
            filters,
            createdAt: Date.now(),
        }
        setSavedSearches((prev) => [newSearch, ...prev])
        return newSearch
    }, [setSavedSearches])

    const deleteSearch = useCallback((id: string) => {
        setSavedSearches((prev) => prev.filter((s) => s.id !== id))
    }, [setSavedSearches])

    return {
        savedSearches,
        saveSearch,
        deleteSearch,
    }
}
