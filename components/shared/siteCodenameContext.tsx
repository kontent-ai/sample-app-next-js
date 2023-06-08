import { FC, ReactNode, createContext, useContext, useMemo } from "react";
import { ValidCollectionCodename } from "../../lib/types/perCollection";

type CodenameContext = Readonly<{
  siteCodename: ValidCollectionCodename;
}>;

const SiteContext = createContext<CodenameContext>({ siteCodename: "ficto_healthtech" });

export const useSiteCodename = () => useContext(SiteContext).siteCodename;

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  children: ReactNode;
}>;

export const SiteCodenameProvider: FC<Props> = props => (
  <SiteContext.Provider value={useMemo(() => ({ siteCodename: props.siteCodename }), [props.siteCodename])}>
    {props.children}
  </SiteContext.Provider>
);
