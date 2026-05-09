import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ScrambleText, ParticleBackground } from './WowEffects';

describe('ScrambleText', () => {
  it('renders a span', () => {
    const { container } = render(<ScrambleText text="Hello" trigger={false} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('shows placeholder asterisks when trigger is false', async () => {
    render(<ScrambleText text="Secret" trigger={false} />);
    expect(await screen.findByText('****************')).toBeInTheDocument();
  });

  it('shows the target text immediately when trigger is true (initial render)', () => {
    render(<ScrambleText text="Ghopay" trigger={true} />);
    // Initial state is set to `text` when trigger is true
    expect(screen.getByText('Ghopay')).toBeInTheDocument();
  });

  it('applies font-mono class', () => {
    const { container } = render(<ScrambleText text="abc" trigger={false} />);
    expect(container.querySelector('span')).toHaveClass('font-mono');
  });

  it('forwards className prop', () => {
    const { container } = render(<ScrambleText text="abc" trigger={false} className="text-green-400" />);
    expect(container.querySelector('span')).toHaveClass('text-green-400');
  });
  it('animates text when trigger becomes true', () => {
    vi.useFakeTimers();
    let frameCb: FrameRequestCallback | null = null;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frameCb = cb;
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});

    const { rerender } = render(<ScrambleText text="Test Space" trigger={false} duration={100} />);
    rerender(<ScrambleText text="Test Space" trigger={true} duration={100} />);
    
    // It should have started the animation loop and registered a callback
    expect(frameCb).not.toBeNull();
    
    // Advance time to start the loop
    act(() => {
      vi.advanceTimersByTime(50);
      if (frameCb) (frameCb as FrameRequestCallback)(performance.now());
    });
    
    // Advance past the duration to complete the loop
    act(() => {
      vi.advanceTimersByTime(150);
      if (frameCb) (frameCb as FrameRequestCallback)(performance.now());
    });
    
    // It should eventually show the final text
    expect(screen.getByText('Test Space')).toBeInTheDocument();

    vi.unstubAllGlobals();
    vi.useRealTimers();
  });
});

describe('ParticleBackground', () => {
  it('renders a canvas element', () => {
    const { container } = render(<ParticleBackground />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('canvas has fixed positioning class', () => {
    const { container } = render(<ParticleBackground />);
    expect(container.querySelector('canvas')).toHaveClass('fixed');
  });

  it('sets up and runs particle animation', () => {
    const fillStyleMock = vi.fn();
    const clearRectMock = vi.fn();
    const beginPathMock = vi.fn();
    const arcMock = vi.fn();
    const fillMock = vi.fn();
    const moveToMock = vi.fn();
    const lineToMock = vi.fn();
    const strokeMock = vi.fn();

    const mockContext = {
      clearRect: clearRectMock,
      beginPath: beginPathMock,
      arc: arcMock,
      fill: fillMock,
      moveTo: moveToMock,
      lineTo: lineToMock,
      stroke: strokeMock,
      set fillStyle(val: string) { fillStyleMock(val); },
      set strokeStyle(val: string) { },
    };

    const canvasMock = {
      getContext: vi.fn(() => mockContext),
      width: 0,
      height: 0,
    };

    // Override createElement for canvas
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (tagName === 'canvas') {
        return canvasMock as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName, options);
    });

    let frameCb: FrameRequestCallback | null = null;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frameCb = cb;
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});

    // Need to use ref on a custom canvas since we can't easily inject the mock into the component's internal ref
    // We can just spy on the getContext of the actual canvas rendered by JSDOM
    // Test early return when ctx is null
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: vi.fn(() => null),
      configurable: true,
    });
    
    // Test early return when canvas is null
    vi.spyOn(React, 'useRef').mockReturnValue({ current: null });
    render(<ParticleBackground />);
    vi.spyOn(React, 'useRef').mockRestore();
    
    const getContextSpy = vi.fn(() => mockContext as unknown as CanvasRenderingContext2D);
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: getContextSpy,
      configurable: true,
    });
    
    // Set window size large to force dist >= 150
    window.innerWidth = 5000;
    window.innerHeight = 5000;

    const { unmount } = render(<ParticleBackground />);
    
    expect(getContextSpy).toHaveBeenCalledWith('2d');
    
    // Simulate animation frame
    if (frameCb) {
      (frameCb as FrameRequestCallback)(performance.now());
    }

    expect(clearRectMock).toHaveBeenCalled();
    expect(arcMock).toHaveBeenCalled();
    
    // Simulate window resize (0, 0) to force particles out of bounds
    window.innerWidth = 0;
    window.innerHeight = 0;
    window.dispatchEvent(new Event('resize'));

    // Another frame to trigger out of bounds logic
    if (frameCb) {
      (frameCb as FrameRequestCallback)(performance.now());
    }
    
    unmount();
    
    vi.unstubAllGlobals();
  });
});
