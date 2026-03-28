import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ReactQueryProvider } from './providers/ReactQueryProvider.tsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>
  </StrictMode>,
)
