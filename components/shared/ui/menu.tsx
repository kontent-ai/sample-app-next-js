import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

type Link = Readonly<{
  url: string;
  title: string;
}>;

type Props = Readonly<{
  links: ReadonlyArray<Link>;
}>;

export const Menu: FC<Props> = props => (
  <div className="flex flex-auto w-full bg-green-300 justify-between shadow-md items-center px-10 grow-0 shrink-0">
    <div>
      <span className="self-start h-full">{useRouter().isPreview ? "Preview" : "Published"}</span>
    </div>
    <menu className="h-16 grow-0 py-1 flex flex-auto shrink-0 justify-end items-center gap-x-5">
      {props.links.map(link => (
        <li
          key={link.title}
          className="h-full"
        >
          <Link
            className="h-full px-5 flex items-center cursor-pointer rounded hover:bg-white"
            href={link.url}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </menu>
  </div>
);

Menu.displayName = "Menu";
