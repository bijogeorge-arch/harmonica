"use client"

import { useLocalStorage } from "./use-local-storage"
import { useCallback } from "react"

export interface CompanyNotes {
    [companyId: string]: string
}

export function useNotes() {
    const [notes, setNotes] = useLocalStorage<CompanyNotes>("harmonic-company-notes", {})

    const updateNote = useCallback((companyId: string, note: string) => {
        setNotes((prev) => ({
            ...prev,
            [companyId]: note,
        }))
    }, [setNotes])

    const getNote = useCallback((companyId: string) => {
        return notes[companyId] || ""
    }, [notes])

    return {
        notes,
        updateNote,
        getNote,
    }
}
