import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QueryInlineError } from '@/shared/ui/feedback'

describe('QueryInlineError', () => {
  it('expõe role=alert para leitores de tela', () => {
    render(
      <QueryInlineError>Algo deu errado.</QueryInlineError>,
    )
    expect(screen.getByRole('alert').textContent).toBe('Algo deu errado.')
  })
})
