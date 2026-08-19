import type { FC } from "react";

type Props = Readonly<{
  className?: string;
}>;

export const GraniteLogo: FC<Props> = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 13.5 16 6l12 7.5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    <path d="M6.5 13.5V24.5H9.5V13.5H6.5Z" fill="currentColor" />
    <path d="M14.5 13.5V24.5H17.5V13.5H14.5Z" fill="currentColor" />
    <path d="M22.5 13.5V24.5H25.5V13.5H22.5Z" fill="currentColor" />
    <path d="M4 24.5H28V27H4V24.5Z" fill="currentColor" />
  </svg>
);
