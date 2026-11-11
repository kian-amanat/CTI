import { Logo } from "@/components/site/logo";
import { NavLinks } from "@/components/site/nav-links";
import { MobileNav } from "@/components/site/mobile-nav";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { HeaderScrollState } from "@/components/site/header-scroll-state";

export function Header() {
  return (
    <header
      id="site-header"
      className="site-header fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-paper/80 backdrop-blur-xl"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        پرش به محتوای اصلی
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Logo />
        <nav aria-label="منوی اصلی" className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          <CallButton className="hidden h-10 sm:inline-flex" trackLabel="header" />
          <MobileNav>
            <CallButton className="w-full" trackLabel="mobile-menu" showNumber />
            <WhatsAppButton className="w-full" trackLabel="mobile-menu" />
          </MobileNav>
        </div>
      </div>
      <HeaderScrollState />
    </header>
  );
}
