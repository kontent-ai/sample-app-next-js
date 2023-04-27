import Link from "next/link";
import { FC } from "react";

type Link = Readonly<{
  url: string;
  title: string;
}>;

type Props = Readonly<{
  links: ReadonlyArray<Link>;
}>;

export const Menu: FC<Props> = props => (
  <menu className="w-full h-16 shadow-md grow-0 px-10 py-1 flex flex-auto shrink-0 justify-end items-center gap-x-5 bg-green-300">
    {props.links.map(link => (
      <li
        key={link.title}
        className="h-full"
      >
        <Link
          className="h-full px-5 flex items-center cursor-pointer rounded"
          href={link.url}
        >
          {link.title}
        </Link>
      </li>
    ))}
  </menu>
);

Menu.displayName = "Menu";
