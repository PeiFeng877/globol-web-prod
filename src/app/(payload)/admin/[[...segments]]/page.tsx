import configPromise from '@payload-config'
import '@payloadcms/next/css'
import { RootPage } from '@payloadcms/next/views'
import React from 'react'
import { importMap } from '../importMap.js'

type Args = {
    params: Promise<{
        segments: string[]
    }>
    searchParams: Promise<{
        [key: string]: string | string[]
    }>
}

export default function Page({ params, searchParams }: Args) {
    return (
        <RootPage
            config={configPromise}
            importMap={importMap}
            params={params}
            searchParams={searchParams}
        />
    )
}
