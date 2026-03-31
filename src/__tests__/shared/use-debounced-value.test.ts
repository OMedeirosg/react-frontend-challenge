import { act, renderHook } from '@testing-library/react'

import { useDebouncedValue } from '@/shared/lib/use-debounced-value'

describe('useDebouncedValue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('updates only after the delay', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebouncedValue(value, delayMs),
      { initialProps: { value: 'a', delayMs: 200 } },
    )

    expect(result.current).toBe('a')

    rerender({ value: 'ab', delayMs: 200 })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('ab')
  })

  it('applies immediately when delayMs is 0', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebouncedValue(value, delayMs),
      { initialProps: { value: 1, delayMs: 0 } },
    )

    expect(result.current).toBe(1)

    rerender({ value: 2, delayMs: 0 })
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(result.current).toBe(2)
  })

  it('cancels previous timers when value changes rapidly', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebouncedValue(value, delayMs),
      { initialProps: { value: 'a', delayMs: 100 } },
    )

    rerender({ value: 'ab', delayMs: 100 })
    rerender({ value: 'abc', delayMs: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('abc')
  })
})

