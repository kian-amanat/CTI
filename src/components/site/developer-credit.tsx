"use client";

import { MailIcon, SparklesIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LinkedInIcon, TelegramIcon } from "@/components/site/brand-icons";
import { developer } from "@/config/site";

const icons = { linkedin: LinkedInIcon, email: MailIcon, telegram: TelegramIcon } as const;

const initials = developer.nameEn
  .split(" ")
  .map((w) => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export function DeveloperCredit() {
  return (
    <Popover>
      <span className="inline-flex items-center gap-1.5">
        طراحی و توسعه:
        <PopoverTrigger className="group inline-flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/5 py-1 ps-1 pe-3 font-bold text-paper transition-colors duration-300 ease-out hover:border-paper/40 hover:bg-paper/10">
          <span className="grid size-6 place-items-center rounded-full bg-tape-deep text-[0.7rem] font-black text-white" dir="ltr">
            {initials}
          </span>
          {developer.name}
          <SparklesIcon className="size-3.5 text-masking" />
        </PopoverTrigger>
      </span>
      <PopoverContent side="top" align="start" sideOffset={10} collisionPadding={16} className="w-80 rounded-2xl border-ink/10 bg-card p-0 text-ink">
        <div className="flex items-center gap-3 border-b border-ink/10 p-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-ink text-base font-black text-paper" dir="ltr">
            {initials}
          </span>
          <div>
            <p className="font-black leading-tight">{developer.name}</p>
            <p className="text-sm text-muted-foreground">{developer.role}</p>
          </div>
        </div>
        <p className="px-4 pt-3 text-sm leading-7">{developer.pitch}</p>
        <ul className="grid gap-1 p-3">
          {developer.links.map((link) => {
            const Icon = icons[link.kind];
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.kind === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-paper-deep"
                >
                  <Icon className="size-4 text-tape" />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
