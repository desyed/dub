"use client";

/***********************************/

/*  Tooltip Contents  */
import Link from "next/link";
import { ReactNode, useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Button from "./button";
import Script from "next/script";
import { ExternalLink, Globe, GlobeIcon, HelpCircle } from "lucide-react";
import { DomainProps } from "#/lib/types";
import { CheckCircleFill, XCircleFill } from "@/components/shared/icons";
import { Drawer } from "vaul";
import useWindowSize from "#/lib/hooks/use-window-size";

export default function Tooltip({
  children,
  content,
  fullWidth,
}: {
  children: ReactNode;
  content: ReactNode | string;
  fullWidth?: boolean;
}) {
  const { isMobile } = useWindowSize();

  if (isMobile) {
    return (
      <Drawer.Root shouldScaleBackground>
        <Drawer.Trigger
          className={`${fullWidth ? "w-full" : "inline-flex"} sm:hidden`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white">
            <div className="mx-auto my-3 h-1 w-12 rounded-full bg-gray-300" />
            <div className="flex min-h-[150px] w-full items-center justify-center overflow-hidden bg-white align-middle shadow-xl">
              {typeof content === "string" ? (
                <span className="block text-center text-sm text-gray-700">
                  {content}
                </span>
              ) : (
                content
              )}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger className="hidden sm:inline-flex" asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            side="top"
            className="z-50 hidden animate-slide-up-fade items-center overflow-hidden rounded-md border border-gray-100 bg-white shadow-md sm:block"
          >
            {typeof content === "string" ? (
              <div className="px-4 py-2">
                <span className="block max-w-xs text-center text-sm text-gray-700">
                  {content}
                </span>
              </div>
            ) : (
              content
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export function TooltipContent({
  title,
  cta,
  href,
  onClick,
}: {
  title: string;
  cta?: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-3 p-4 text-center sm:max-w-xs">
      <p className="text-sm text-gray-700">{title}</p>
      {cta &&
        (href ? (
          <Link
            href={href}
            className="mt-4 w-full rounded-md border border-black bg-black px-3 py-1.5 text-center text-sm text-white transition-all hover:bg-white hover:text-black"
          >
            {cta}
          </Link>
        ) : onClick ? (
          <button
            className="mt-4 w-full rounded-md border border-black bg-black px-3 py-1.5 text-center text-sm text-white transition-all hover:bg-white hover:text-black"
            onClick={onClick}
          >
            {cta}
          </button>
        ) : null)}
    </div>
  );
}

export function InfoTooltip({ content }: { content: ReactNode | string }) {
  return (
    <Tooltip content={content}>
      <HelpCircle className="h-4 w-4 text-gray-500" />
    </Tooltip>
  );
}

export function SSOWaitlist() {
  const [opening, setOpening] = useState(false);
  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />

      <div className="flex max-w-sm flex-col items-center space-y-3 p-4 text-center">
        <h3 className="font-semibold text-gray-800">SAML/SSO</h3>
        <p className="text-sm text-gray-600">
          SAML/SSO is coming soon. Interested in early access? Join the
          waitlist.
        </p>

        <Button
          text="Join waitlist"
          loading={opening}
          onClick={() => {
            setOpening(true);
            // @ts-ignore
            window.Tally?.openPopup("waexqB", {
              width: 540,
              onOpen: () => setOpening(false),
            });
          }}
        />
      </div>
    </>
  );
}

export function DomainsTooltip({
  domains,
  title,
  cta,
  href,
}: {
  domains: DomainProps[];
  title: string;
  cta?: string;
  href: string;
}) {
  return (
    <div
      className="flex w-full flex-col items-center space-y-2 p-4 sm:w-60"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="px-2 text-sm text-gray-500">{title}</p>
      <div className="flex w-full flex-col">
        {domains.map(({ slug, verified }) => (
          <a
            key={slug}
            href={`https://${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-md p-2 transition-all hover:bg-gray-100"
          >
            <div className="flex items-center space-x-1">
              {verified ? (
                <CheckCircleFill className="h-5 w-5 text-blue-500" />
              ) : (
                <XCircleFill className="h-5 w-5 text-gray-300" />
              )}
              <p className="text-sm font-semibold text-gray-500">{slug}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 sm:invisible sm:group-hover:visible" />
          </a>
        ))}
      </div>

      <div className="mt-2 w-full px-2">
        <Link
          href={href}
          className="block rounded-md border border-black bg-black px-3 py-1.5 text-center text-sm text-white transition-all hover:bg-white hover:text-black"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
