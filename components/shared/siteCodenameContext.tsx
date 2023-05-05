import { FC, ReactNode, createContext, useContext, useMemo } from "react";

type CodenameContext = Readonly<{
  siteCodename: string;
}>;

const SiteContext = createContext<CodenameContext>({ siteCodename: "" });

export const useSiteCodename = () => useContext(SiteContext).siteCodename;

type Props = Readonly<{
  siteCodename: string;
  children: ReactNode;
}>;

export const SiteCodenameProvider: FC<Props> = props => (
  <SiteContext.Provider value={useMemo(() => ({ siteCodename: props.siteCodename }), [props.siteCodename])}>
    {props.children}
  </SiteContext.Provider>
);
