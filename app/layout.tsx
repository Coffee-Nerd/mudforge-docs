import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'MudForge Docs',
    template: '%s - MudForge Docs'
  },
  description: 'Documentation for MudForge Web Client - a browser-based MUD client',
}

const navbar = (
  <Navbar
    logo={<span style={{ fontWeight: 700 }}>MudForge Docs</span>}
    projectLink="https://github.com/your-username/mud-web-client"
  />
)

const footer = <Footer>MudForge Web Client Documentation</Footer>

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/your-username/mudforge-docs/tree/main"
          footer={footer}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
