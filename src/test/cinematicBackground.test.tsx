import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CinematicBackgroundVideo } from '../components/background/CinematicBackgroundVideo';
import { AppLayout } from '../components/layout/AppLayout';

describe('CinematicBackgroundVideo Component & Hero Exclusion', () => {
  let originalInnerHeight: number;
  let originalScrollY: number;

  beforeEach(() => {
    originalInnerHeight = window.innerHeight;
    originalScrollY = window.scrollY;
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 4000,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight });
    Object.defineProperty(window, 'scrollY', { value: originalScrollY });
    vi.restoreAllMocks();
  });

  it('renders persistent background video with MP4 and WebM sources and poster fallback', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <CinematicBackgroundVideo />
      </MemoryRouter>
    );

    const videoEl = container.querySelector('video');
    expect(videoEl).toBeInTheDocument();
    expect(videoEl?.getAttribute('poster')).toBe(
      '/images/background/orbital-city-scroll-poster.webp'
    );

    const sources = container.querySelectorAll('source');
    expect(sources.length).toBe(2);
    expect(sources[0].getAttribute('src')).toBe('/video/orbital-city-scroll.mp4');
    expect(sources[0].getAttribute('type')).toBe('video/mp4');
    expect(sources[1].getAttribute('src')).toBe('/video/orbital-city-scroll.webm');
    expect(sources[1].getAttribute('type')).toBe('video/webm');
  });

  it('initially hides the background video while hero section occupies the viewport', async () => {
    // Create a mock hero element in document body
    const heroMock = document.createElement('div');
    heroMock.setAttribute('data-hero-section', 'true');
    heroMock.getBoundingClientRect = () => ({
      top: 0,
      bottom: 750,
      height: 750,
      width: 1200,
      left: 0,
      right: 1200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    document.body.appendChild(heroMock);

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <CinematicBackgroundVideo />
      </MemoryRouter>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('opacity-0');

    document.body.removeChild(heroMock);
  });

  it('reveals the background video when scrolled past the hero section and hides on reverse scroll', async () => {
    vi.useFakeTimers();

    const heroMock = document.createElement('div');
    heroMock.setAttribute('data-hero-section', 'true');
    heroMock.getBoundingClientRect = () => ({
      top: -600,
      bottom: 150,
      height: 750,
      width: 1200,
      left: 0,
      right: 1200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    document.body.appendChild(heroMock);

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <CinematicBackgroundVideo />
      </MemoryRouter>
    );

    const wrapper = container.firstChild as HTMLElement;

    // Fast-forward initial measurement timer
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Simulate scrolling past hero into subsequent sections
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1200, writable: true });
      fireEvent.scroll(window);
    });

    expect(wrapper).toHaveClass('opacity-100');

    // Simulate reverse scrolling back up into the hero section
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);
    });

    expect(wrapper).toHaveClass('opacity-0');

    document.body.removeChild(heroMock);
    vi.useRealTimers();
  });

  it('mounts CinematicBackgroundVideo inside AppLayout behind main content', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout />
      </MemoryRouter>
    );

    const videoEl = container.querySelector('video');
    expect(videoEl).toBeInTheDocument();

    const mainEl = container.querySelector('main#main-content');
    expect(mainEl).toBeInTheDocument();
    expect(mainEl).toHaveClass('relative', 'z-10');
  });
});
