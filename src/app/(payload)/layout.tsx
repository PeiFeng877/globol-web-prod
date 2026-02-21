/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import configPromise from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap.js'
import type { ServerFunctionClient } from 'payload'

const serverFunction: ServerFunctionClient = async function (args) {
    'use server'
    return handleServerFunctions({
        ...args,
        config: configPromise,
        importMap,
    })
}

const args = {
    config: configPromise,
    importMap,
    serverFunction,
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <RootLayout {...args}>{children}</RootLayout>
}
