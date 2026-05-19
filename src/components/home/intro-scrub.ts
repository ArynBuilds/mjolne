import gsap from 'gsap';

interface IntroScrubOptions {
  section: HTMLElement;
}

interface Geometry {
  vw: number;
  vh: number;
  stripHeight: number;
}

// Cinematic strip occupies the top 22vh of the viewport once the user
// commits forward. The shelf below it gets the remaining 78vh. This pair
// is the single source of truth for the post-scrub layout — anything that
// reads strip height (CSS, GSAP) lives downstream of this constant.
const STRIP_VH = 0.22;

// One canonical tempo. Forward timeline plays at 1x; reverse at 1.4x.
const TRANSITION_DURATION = 0.9;
// Wheel/touch lock that runs *after* a transition completes. Long enough to
// outlast trackpad inertia so a single swipe can never trigger two transitions.
const TRANSITION_COOLDOWN_MS = 1500;

function readGeometry(): Geometry {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return { vw, vh, stripHeight: Math.round(vh * STRIP_VH) };
}

type State = 'hero' | 'shelf';

/**
 * Wheel-jacked state machine for the home intro. Two states ('hero' and
 * 'shelf'); each transition is a fixed-duration GSAP animation. A single
 * scroll input commits one full state change — there's no scrub, no
 * threshold, no chance of getting stuck mid-animation.
 *
 * The 'shelf' state is reached when the hero video shrinks from full-screen
 * to a 100vw × 22vh cinematic strip at the top of the viewport, revealing
 * a row of 5 floor-to-ceiling product columns beneath it. From 'shelf' the
 * page scrolls naturally into whatever lives below; backward intent at the
 * section top reverses the timeline back to 'hero'.
 */
export function runIntroScrub({ section }: IntroScrubOptions): () => void {
  if (typeof window === 'undefined') return () => {};

  let teardown: (() => void) | null = null;
  let busyRef = { current: false };

  function build() {
    teardown?.();

    const g = readGeometry();

    // Deep-link support: /#collection lands directly in shelf state.
    const initialState: State =
      window.location.hash === '#collection' ? 'shelf' : 'hero';
    let state: State = initialState;
    let cooldownUntil = 0;
    busyRef.current = false;

    function setBusy(v: boolean) {
      busyRef.current = v;
    }

    function emitState(next: State) {
      window.dispatchEvent(new CustomEvent('intro:state', { detail: { state: next } }));
    }
    emitState(initialState);

    // ---- Master transition timeline (paused) -------------------------
    const tl = gsap.timeline({ paused: true });

    gsap.set('.intro-video-wrapper', {
      width: g.vw,
      height: g.vh,
    });
    gsap.set('.intro-surface-veil', { opacity: 0 });
    gsap.set('.intro-shelf-row', { opacity: 0, y: 24, pointerEvents: 'none' });
    gsap.set('.shelf-column', { opacity: 0, y: 16 });
    gsap.set('.intro-strip-overlay', { opacity: 0, y: 10 });
    // Explicit hero-state values for the elements that animate OUT during the
    // forward timeline. Without these, deep-linking to /#collection (which
    // calls tl.progress(1) before the timeline has played) leaves GSAP
    // without a captured from-state to reverse back to.
    gsap.set('.intro-hero-overlay', { opacity: 1, y: 0 });
    gsap.set('.intro-marquee', { opacity: 1, y: 0 });

    tl.to(
      '.intro-hero-overlay',
      { opacity: 0, y: -16, duration: TRANSITION_DURATION * 0.71 },
      0,
    );
    tl.to(
      '.intro-marquee',
      { opacity: 0, y: 18, duration: TRANSITION_DURATION * 0.71 },
      0,
    );
    tl.to(
      '.intro-surface-veil',
      { opacity: 1, duration: TRANSITION_DURATION * 0.78 },
      0.05,
    );
    tl.to(
      '.intro-video-wrapper',
      {
        height: g.stripHeight,
        duration: TRANSITION_DURATION,
        ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      0,
    );
    tl.to(
      '.intro-shelf-row',
      {
        opacity: 1,
        y: 0,
        duration: TRANSITION_DURATION * 0.78,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      0.18,
    );
    tl.to(
      '.shelf-column',
      {
        opacity: 1,
        y: 0,
        duration: TRANSITION_DURATION * 0.86,
        stagger: 0.05,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      0.22,
    );
    tl.to(
      '.intro-strip-overlay',
      {
        opacity: 1,
        y: 0,
        duration: TRANSITION_DURATION * 0.65,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      0.35,
    );

    // Activate column pointer events at the end of forward; remove on reverse.
    tl.eventCallback('onComplete', () => {
      gsap.set('.intro-shelf-row', { pointerEvents: 'auto' });
    });
    tl.eventCallback('onReverseComplete', () => {
      gsap.set('.intro-shelf-row', { pointerEvents: 'none' });
    });

    // Deep-link entry: fast-forward to the end state.
    if (initialState === 'shelf') {
      tl.progress(1).pause();
      gsap.set('.intro-shelf-row', { pointerEvents: 'auto' });
    }

    // ---- Helpers -----------------------------------------------------
    function sectionTopAbs(): number {
      return section.offsetTop;
    }
    function atSectionTop(): boolean {
      // Use scrollY directly instead of bounding rect — Lenis smooth scrolling
      // settles at sub-pixel positions, so a strict ±2px rect check rejects
      // wheel-ups that should reverse. 20px tolerance is generous enough to
      // never miss, narrow enough to not fire when the user is genuinely
      // scrolled into the next section.
      return window.scrollY <= 20;
    }
    function lenisStop() {
      window.__lenis?.stop();
    }
    function lenisStart() {
      window.__lenis?.start();
    }
    function instantScrollTo(y: number) {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    }

    function transitionForward(): Promise<void> {
      return new Promise((resolve) => {
        setBusy(true);
        emitState('shelf');
        lenisStop();
        tl.timeScale(1)
          .play()
          .eventCallback('onComplete', () => {
            // Re-apply the pointer-events flip (eventCallback overwrites).
            gsap.set('.intro-shelf-row', { pointerEvents: 'auto' });
            state = 'shelf';
            cooldownUntil = performance.now() + TRANSITION_COOLDOWN_MS;
            lenisStart();
            setBusy(false);
            resolve();
          });
      });
    }

    function transitionBackward(): Promise<void> {
      return new Promise((resolve) => {
        setBusy(true);
        emitState('hero');
        lenisStop();
        // Snap to the exact section top BEFORE reversing the timeline so the
        // user can't trigger a reverse with a sliver of the next section
        // still visible at the bottom.
        instantScrollTo(sectionTopAbs());
        tl.timeScale(1.4)
          .reverse()
          .eventCallback('onReverseComplete', () => {
            gsap.set('.intro-shelf-row', { pointerEvents: 'none' });
            state = 'hero';
            cooldownUntil = performance.now() + TRANSITION_COOLDOWN_MS;
            lenisStart();
            setBusy(false);
            resolve();
          });
      });
    }

    // ---- Input handling ---------------------------------------------
    function handleIntent(direction: 1 | -1, e: Event) {
      const now = performance.now();

      if (busyRef.current) {
        e.preventDefault();
        return;
      }

      if (now < cooldownUntil) {
        if (atSectionTop() && direction < 0) e.preventDefault();
        return;
      }

      if (state === 'hero') {
        e.preventDefault();
        if (direction > 0) {
          transitionForward();
        }
      } else if (direction < 0 && atSectionTop()) {
        e.preventDefault();
        transitionBackward();
      }
    }

    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < 1) return;
      handleIntent(e.deltaY > 0 ? 1 : -1, e);
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0]?.clientY ?? 0;
    }
    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchStartY - y;
      if (Math.abs(dy) < 16) return;
      handleIntent(dy > 0 ? 1 : -1, e);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (busyRef.current) return;
      if (
        e.key === 'PageDown' ||
        e.key === 'ArrowDown' ||
        e.key === ' ' ||
        e.key === 'End'
      ) {
        if (state === 'hero') {
          e.preventDefault();
          transitionForward();
        }
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp' || e.key === 'Home') {
        if (state === 'shelf' && atSectionTop()) {
          e.preventDefault();
          transitionBackward();
        }
      }
    }

    function onScroll() {
      if (state !== 'hero' || busyRef.current) return;
      if (window.scrollY > 4) instantScrollTo(0);
    }

    // Explicit nav-link bridges. Header dispatches these on MJØLNE/Kahve
    // clicks so the state machine can react to URL-level intent without
    // racing the scroll handler.
    function onRequestHero() {
      if (busyRef.current) return;
      if (state === 'shelf') {
        transitionBackward();
      } else {
        // Already in hero, just make sure we're at the top of the section.
        instantScrollTo(sectionTopAbs());
      }
    }
    function onRequestShelf() {
      if (busyRef.current) return;
      if (state === 'hero') {
        transitionForward();
      } else {
        // Already in shelf; bring the shelf into view if the user has
        // scrolled further down into the page.
        instantScrollTo(sectionTopAbs());
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('intro:request-hero', onRequestHero);
    window.addEventListener('intro:request-shelf', onRequestShelf);

    teardown = () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('intro:request-hero', onRequestHero);
      window.removeEventListener('intro:request-shelf', onRequestShelf);
      tl.kill();
      lenisStart();
      window.dispatchEvent(new CustomEvent('intro:state', { detail: { state: null } }));
    };
  }

  build();

  let resizeTimer: number | null = null;
  let lastVw = window.innerWidth;
  let lastVh = window.innerHeight;
  function onResize() {
    if (window.innerWidth === lastVw && window.innerHeight === lastVh) return;
    lastVw = window.innerWidth;
    lastVh = window.innerHeight;
    if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function attemptRebuild() {
      if (busyRef.current) {
        resizeTimer = window.setTimeout(attemptRebuild, 200);
        return;
      }
      build();
    }, 200);
  }
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    teardown?.();
  };
}
