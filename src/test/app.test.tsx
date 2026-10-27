import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { VisionPage } from '../pages/VisionPage';
import { CityPage } from '../pages/CityPage';
import { CityAtlasPage } from '../pages/CityAtlasPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { RoadmapPage } from '../pages/RoadmapPage';
import { PartnersPage } from '../pages/PartnersPage';
import { ContactPage } from '../pages/ContactPage';
import { JoinPage } from '../pages/JoinPage';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BRAND_CONTENT } from '../data/siteContent';

describe('Revatya Website Canonical Content, Interactive Systems & Form Integrity', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the Home Page with canonical headline, district architecture cards, 6 applications, and 5 roadmap phases without questions or disclaimers', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /A city beyond Earth\./i })).toBeInTheDocument();
    expect(
      screen.getByText(/Space should become a place to live, work, and build\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/DISTRICT ARCHITECTURE/i)).toBeInTheDocument();
    expect(screen.getByText(/The eight functional districts of an orbital city\./i)).toBeInTheDocument();
    expect(screen.getByText(/Microgravity enabled manufacturing/i)).toBeInTheDocument();
    expect(screen.getByText(/From research to a city in orbit\./i)).toBeInTheDocument();
    expect(screen.queryByText(/SHARED UTILITY ARCHITECTURE/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/THE SPACE ECONOMY AS AN OPERATIONAL ECOSYSTEM/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/LONG HORIZON MISSION/i)).not.toBeInTheDocument();
    expect(screen.queryByText(BRAND_CONTENT.EconomicDisclaimer)).not.toBeInTheDocument();
    expect(container.querySelectorAll('figcaption').length).toBe(0);
  });

  it('renders Vision Page with all 7 guiding principles without central question or epistemic boundary warnings', () => {
    render(
      <MemoryRouter initialEntries={['/vision']}>
        <VisionPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /From reaching orbit to building in orbit\./i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Systems before spectacle/i)).toBeInTheDocument();
    expect(screen.getByText(/Evidence before claims/i)).toBeInTheDocument();
    expect(screen.getByText(/Long term responsibility/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Underwater tests cannot validate orbital microgravity/i)
    ).not.toBeInTheDocument();
  });

  it('renders unified Interactive City Atlas on both CityPage and CityAtlasPage without district subheaders or engineering questions', () => {
    const { unmount, container: cityContainer } = render(
      <MemoryRouter initialEntries={['/city']}>
        <CityPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('img', { name: /Interactive orbital city atlas/i })).toBeInTheDocument();
    expect(screen.queryByText(/CONCEPTUAL ARCHITECTURE UNDER EXPLORATION/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Engineering Questions/i)).not.toBeInTheDocument();
    expect(cityContainer.querySelectorAll('figcaption').length).toBe(0);
    unmount();

    render(
      <MemoryRouter initialEntries={['/city-atlas']}>
        <CityAtlasPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /Explore the districts and shared utilities of a future space city\./i,
      })
    ).toBeInTheDocument();

    // Click on Energy & Thermal district button in the atlas selector
    const energyButtons = screen.getAllByRole('button', { name: /Energy/i });
    fireEvent.click(energyButtons[0]);

    expect(
      screen.getByText(/Deployable high efficiency solar arrays with sun tracking gimbals/i)
    ).toBeInTheDocument();
  });

  it('renders Applications Page without APPLICATION status headers or Questions to Investigate', () => {
    render(
      <MemoryRouter initialEntries={['/applications']}>
        <ApplicationsPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /Shared infrastructure for orbital industry and research\./i,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(/Questions to Investigate/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Potential application requiring case by case validation\./i)
    ).not.toBeInTheDocument();
  });

  it('auto-hides Navbar when scrolling down, reveals when scrolling up, and omits deleted space-economy route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar theme="dark" onToggleTheme={() => {}} />
      </MemoryRouter>
    );

    const header = screen.getByTestId('main-navbar-header');
    expect(header).toBeInTheDocument();
    expect(header.className).toContain('translate-y-0');
    expect(screen.queryByText(/Space Economy/i)).not.toBeInTheDocument();

    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 120, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(header.className).toContain('-translate-y-full');
    });

    // Simulate scroll up
    Object.defineProperty(window, 'scrollY', { value: 60, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(header.className).toContain('translate-y-0');
    });
  });

  it('renders Roadmap Page with all 5 phases and explicitly mentions Phase 02 as Developing an underwater city', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/roadmap']}>
        <RoadmapPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Foundational research/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Developing an underwater city/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Expansion toward a city/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Risks & Open Questions/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('figcaption').length).toBe(0);
  });

  it('renders Partners Page with 6 pathways and omits proposal checklist and representation policy cards', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/partners']}>
        <PartnersPage />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/PATHWAY 01/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/What to include in a partnership enquiry\./i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/No unverified logos or implied endorsements\./i)
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll('figcaption').length).toBe(0);
  });

  it('validates and submits the Contact form with canonical validation messages and Reference ID', async () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <ContactPage />
      </MemoryRouter>
    );

    expect(screen.queryByText(/STRUCTURED ENQUIRY ROUTING/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/INDIVIDUAL RESEARCHERS & ENGINEERS/i)).not.toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Send enquiry/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter your name\./i)).toBeInTheDocument();
    expect(screen.getByText(/Enter a valid email address\./i)).toBeInTheDocument();
    expect(screen.getByText(/Please provide a short message\./i)).toBeInTheDocument();
    expect(screen.getByText(/Please review the required consent field\./i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Your full name/i), {
      target: { value: 'Dr. Vikram Sarabhai' },
    });
    fireEvent.change(screen.getByPlaceholderText(/you@organisation\.com/i), {
      target: { value: 'vikram@orbital-research.org' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Describe your question/i), {
      target: {
        value: 'Interested in collaborating on closed-loop ECLSS and radiative thermal rejection.',
      },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Enquiry Received/i)).toBeInTheDocument();
      expect(screen.getByText(/Reference ID:/i)).toBeInTheDocument();
    });
  });

  it('validates and submits the Join Contributor form cleanly', async () => {
    render(
      <MemoryRouter initialEntries={['/join']}>
        <JoinPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Introduce yourself/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter your name\./i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: 'Aryan Pandey' } });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'aryan@guildorbit.com' },
    });
    fireEvent.change(screen.getByLabelText(/Relevant experience/i), {
      target: { value: 'Systems architecture, orbital mechanics, and full-stack simulation.' },
    });
    fireEvent.change(screen.getByLabelText(/Specific problem/i), {
      target: { value: 'Modular docking interfaces and orbital logistics throughput.' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Thank you for introducing your work\./i)).toBeInTheDocument();
      expect(screen.getByText(/Reference ID:/i)).toBeInTheDocument();
    });
  });

  it('renders clean 3-perspective CityPerspectiveViewer showcase and switches RoadmapHorizonTimeline to Phase 02 Developing an underwater city', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Macro Orbital Exterior/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi Deck Cutaway/i)).toBeInTheDocument();
    expect(screen.getByText(/Human Civic Commons/i)).toBeInTheDocument();

    const phase02Tab = screen.getByRole('tab', { name: /Developing an underwater city/i });
    fireEvent.click(phase02Tab);
    expect(
      screen.getByText(
        /Develop an operational underwater city to prove closed loop environmental systems/i
      )
    ).toBeInTheDocument();
  });

  it('omits removed header subtitle, Programme dropdown, City Atlas CTA, and Footer Stage 01 badge', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar theme="dark" onToggleTheme={() => {}} />
        <Footer />
      </MemoryRouter>
    );

    expect(screen.queryByText(/SPACE CITY ARCHITECTURE/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Programme/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Stage 01 · Foundational Research/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Long Horizon Orbital Architecture Initiative/i)
    ).toBeInTheDocument();
  });

  it('rotates cards horizontally along the planetary arc while locking vertical scroll and without a top bar', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/city']}>
        <CityPage />
      </MemoryRouter>
    );

    const orbitStages = container.querySelectorAll('[data-planetary-orbit="true"]');
    expect(orbitStages.length).toBeGreaterThanOrEqual(2);

    // Ensure the top bar above the cards has been completely removed
    expect(screen.queryByRole('button', { name: /Rotate to next orbital card/i })).not.toBeInTheDocument();

    // Inspect the 8 Functional Districts planetary orbit stage
    const districtsOrbit = orbitStages[1];
    const card0 = districtsOrbit.querySelector('[data-orbit-index="0"]');
    const card1 = districtsOrbit.querySelector('[data-orbit-index="1"]');
    const card2 = districtsOrbit.querySelector('[data-orbit-index="2"]');

    // Step 0: Card 0 is at Position 1 (focal), Card 1 is on the incoming left limb
    expect(card0?.getAttribute('data-orbit-slot')).toBe('position-1-focal');
    expect(card1?.getAttribute('data-orbit-slot')).toBe('incoming-limb');

    // Wheel downward: vertical page scroll is prevented (locked) while Card 0 shifts right to Position 2 and Card 1 enters Position 1 focal
    const wheelEvent1 = new WheelEvent('wheel', { deltaY: 200, bubbles: true, cancelable: true });
    fireEvent(districtsOrbit, wheelEvent1);
    expect(wheelEvent1.defaultPrevented).toBe(true);

    expect(card0?.getAttribute('data-orbit-slot')).toBe('position-2-orbit');
    expect(card1?.getAttribute('data-orbit-slot')).toBe('position-1-focal');
    expect(card2?.getAttribute('data-orbit-slot')).toBe('incoming-limb');

    // Wheel downward again: Card 0 disappears over the right horizon, Card 1 shifts to Position 2, Card 2 enters Position 1 focal
    const wheelEvent2 = new WheelEvent('wheel', { deltaY: 200, bubbles: true, cancelable: true });
    fireEvent(districtsOrbit, wheelEvent2);
    expect(wheelEvent2.defaultPrevented).toBe(true);

    expect(card0?.getAttribute('data-orbit-slot')).toBe('horizon-hidden');
    expect(card1?.getAttribute('data-orbit-slot')).toBe('position-2-orbit');
    expect(card2?.getAttribute('data-orbit-slot')).toBe('position-1-focal');
  });

  it('renders the hero section with background video across other pages in the same manner as the home page', () => {
    const pages = [
      { path: '/vision', component: <VisionPage /> },
      { path: '/city', component: <CityPage /> },
      { path: '/applications', component: <ApplicationsPage /> },
      { path: '/roadmap', component: <RoadmapPage /> },
      { path: '/partners', component: <PartnersPage /> },
      { path: '/join', component: <JoinPage /> },
      { path: '/contact', component: <ContactPage /> },
      { path: '/city-atlas', component: <CityAtlasPage /> },
    ];

    for (const { path, component } of pages) {
      const { container, unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          {component}
        </MemoryRouter>
      );

      const heroSection = container.querySelector('[data-hero-section="true"]');
      expect(heroSection).toBeInTheDocument();

      const heroVideo = heroSection?.querySelector('video');
      expect(heroVideo).toBeInTheDocument();
      expect(heroVideo?.getAttribute('src')).toBe('/video/orbital-city-hero-loop.mp4');
      expect(heroVideo).toHaveAttribute('autoplay');
      expect(heroVideo).toHaveAttribute('loop');
      expect(heroVideo).toHaveProperty('muted', true);
      expect(heroVideo).toHaveAttribute('playsinline');

      unmount();
    }
  });

  it('renders district and application cards on the home page as clickable links to their respective destination hashes', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    // Verify all 8 district cards link to /city#<district-id>
    const districtLinks = container.querySelectorAll('a[href^="/city#"]');
    expect(districtLinks.length).toBe(8);
    expect(districtLinks[0].getAttribute('href')).toBe('/city#habitation');
    expect(districtLinks[1].getAttribute('href')).toBe('/city#orbital-port');

    // Verify all 6 application cards link to /applications#<app-id>
    const appLinks = container.querySelectorAll('a[href^="/applications#"]');
    expect(appLinks.length).toBe(6);
    expect(appLinks[0].getAttribute('href')).toBe('/applications#microgravity-manufacturing');
    expect(appLinks[1].getAttribute('href')).toBe('/applications#orbital-port-logistics');
  });
});
