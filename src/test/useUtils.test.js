import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useClickOutside, useKeyboardShortcut } from '../hooks/useUtils';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应在延迟后返回最新值', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('值变化后应在延迟时间后才更新', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 300 },
    });

    rerender({ value: 'second', delay: 300 });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('second');
  });

  it('连续变化只取最后一次值', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: 'c' });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: 'd' });
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('d');
  });
});

describe('useKeyboardShortcut', () => {
  it('按下指定键应触发回调', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('x', handler));

    const event = new KeyboardEvent('keydown', { key: 'x' });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('enabled 为 false 时不触发', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('x', handler, false));

    const event = new KeyboardEvent('keydown', { key: 'x' });
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});
