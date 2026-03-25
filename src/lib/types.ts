export interface Lead {
  id: string;
  county: string;
  decedent_name: string;
  case_number: string;
  filing_date: string;
  executor_name: string | null;
  executor_address: string | null;
  property_address: string | null;
  parcel_id: string | null;
  assessed_value: number | null;
  estimated_market_value: number | null;
  mortgage_balance_estimate: number | null;
  estimated_equity: number | null;
  deal_score: number | null;
  deal_score_reason: string | null;
  status: "new" | "contacted" | "skipped" | "saved";
  created_at: string;
  county_url: string | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  plan: "solo" | "investor" | "team" | "free";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface AlertSettings {
  id: string;
  user_id: string;
  min_deal_score: number;
  counties: string[];
  email_enabled: boolean;
  sms_enabled: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  plan: "solo" | "investor" | "team";
  status: "active" | "canceled" | "past_due";
  current_period_end: string;
  created_at: string;
}

export const COUNTIES = [
  "Cobb",
  "DeKalb",
  "Fulton",
  "Fayette",
  "Newton",
  "Douglas",
  "Gwinnett",
] as const;

export type County = (typeof COUNTIES)[number];

export const COUNTY_URLS: Record<County, string> = {
  Cobb: "https://qpublic.schneidercorp.com/Application.aspx?AppID=1051&LayerID=23951&PageTypeID=2&PageID=9967",
  DeKalb:
    "https://qpublic.schneidercorp.com/Application.aspx?AppID=994&LayerID=20256&PageTypeID=2&PageID=8822",
  Fulton:
    "https://qpublic.schneidercorp.com/Application.aspx?App=FultonCountyGA&Layer=Parcels&PageType=Search",
  Fayette:
    "https://qpublic.schneidercorp.com/Application.aspx?AppID=942&LayerID=18406&PageTypeID=2&PageID=8204",
  Newton:
    "https://qpublic.schneidercorp.com/Application.aspx?AppID=794&LayerID=11825&PageTypeID=2&PageID=5724",
  Douglas:
    "https://qpublic.schneidercorp.com/Application.aspx?AppID=988&LayerID=20162&PageTypeID=2&PageID=8760",
  Gwinnett:
    "https://qpublic.schneidercorp.com/Application.aspx?AppID=1282&LayerID=43872&PageTypeID=2&PageID=16058",
};

export const PLANS = {
  solo: {
    name: "Solo",
    price: 99,
    stripe_price_id: "solo_monthly",
    counties: 3,
    features: [
      "3 counties of your choice",
      "Daily lead delivery",
      "Email alerts",
      "AI deal scoring",
    ],
  },
  investor: {
    name: "Investor",
    price: 249,
    stripe_price_id: "investor_monthly",
    counties: 7,
    features: [
      "All 7 Metro Atlanta counties",
      "AI deal scoring & summaries",
      "CSV export",
      "Priority data refresh",
    ],
  },
  team: {
    name: "Team",
    price: 499,
    stripe_price_id: "team_monthly",
    counties: 7,
    features: [
      "Everything in Investor",
      "3 team seats",
      "API access",
      "Priority support",
      "Custom county requests",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
