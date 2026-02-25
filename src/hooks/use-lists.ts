"use client"

import { useLocalStorage } from "./use-local-storage"
import { useCallback } from "react"

export interface CompanyList {
    id: string
    name: string
    companyIds: string[]
    createdAt: number
}

export function useLists() {
    const [lists, setLists] = useLocalStorage<CompanyList[]>("harmonic-lists", [])

    const createList = useCallback((name: string) => {
        const newList: CompanyList = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            companyIds: [],
            createdAt: Date.now(),
        }
        setLists((prev) => [...prev, newList])
        return newList
    }, [setLists])

    const deleteList = useCallback((id: string) => {
        setLists((prev) => prev.filter((l) => l.id !== id))
    }, [setLists])

    const addCompanyToList = useCallback((listId: string, companyId: string) => {
        setLists((prev) =>
            prev.map((list) => {
                if (list.id === listId && !list.companyIds.includes(companyId)) {
                    return { ...list, companyIds: [...list.companyIds, companyId] }
                }
                return list
            })
        )
    }, [setLists])

    const removeCompanyFromList = useCallback((listId: string, companyId: string) => {
        setLists((prev) =>
            prev.map((list) => {
                if (list.id === listId) {
                    return { ...list, companyIds: list.companyIds.filter((id) => id !== companyId) }
                }
                return list
            })
        )
    }, [setLists])

    const isCompanyInList = useCallback((listId: string, companyId: string) => {
        const list = lists.find((l) => l.id === listId)
        return list ? list.companyIds.includes(companyId) : false
    }, [lists])

    return {
        lists,
        createList,
        deleteList,
        addCompanyToList,
        removeCompanyFromList,
        isCompanyInList,
    }
}
