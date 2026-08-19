import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";

export const complianceContentTypes = {
  regulatoryNotice: "regulatory_notice",
  riskAlert: "risk_alert",
} as const;

export const complianceElements = {
  title: "title",
  body: "body",
  status: "status",
  effectiveDate: "compliance_fields__effective_date",
  audience: "compliance_fields__audience",
  documentClass: "compliance_fields__document_class",
} as const;

type ComplianceFields = {
  readonly [complianceElements.effectiveDate]: Elements.DateTimeElement;
  readonly [complianceElements.audience]: Elements.TaxonomyElement;
  readonly [complianceElements.documentClass]: Elements.TaxonomyElement;
};

export type RegulatoryNotice = IContentItem<
  {
    readonly title: Elements.TextElement;
    readonly body: Elements.RichTextElement;
  } & ComplianceFields,
  typeof complianceContentTypes.regulatoryNotice
>;

export type RiskAlert = IContentItem<
  {
    readonly title: Elements.TextElement;
    readonly body: Elements.RichTextElement;
    readonly status: Elements.TextElement;
  } & ComplianceFields,
  typeof complianceContentTypes.riskAlert
>;

export type FeaturedNotice = RiskAlert | RegulatoryNotice;

export const isRiskAlert = (item: FeaturedNotice): item is RiskAlert =>
  item.system.type === complianceContentTypes.riskAlert;
