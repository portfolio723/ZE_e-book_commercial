import rooftopSolar from "@/assets/rooftop-solar.jpg";
import facility from "@/assets/facility.jpg";
import panelDetail from "@/assets/panel-detail.jpg";
import frontCover from "@/assets/Front.png";
import backCover from "@/assets/Back.png";
import { BulletList, Card, PageShell, Rule, type PageTone } from "./primitives";

export const PAGE_ASSETS = [frontCover, backCover, rooftopSolar, facility, panelDetail];

/**
 * All copy on these pages is taken verbatim from the supplied
 * "Commercial Solar eBook" source document (Google Docs tabs).
 * No marketing copy is invented here.
 */
export const SOURCE = {
  title: "Key Benefits of Commercial Solar",
  intro:
    "Investing in commercial solar delivers financial, operational, and environmental advantages that continue for more than two decades.",
  financial: [
    "Reduce electricity bills by up to 90%",
    "Recover investment within 3–5 years",
    "Generate free electricity for over 25 years",
    "Improve annual business profitability",
    "Protect against rising electricity tariffs",
  ],
  operational: [
    "Lower production costs",
    "Increase operational efficiency",
    "Improve energy reliability",
    "Reduce dependence on grid power",
    "Stabilize long-term energy expenses",
  ],
  sustainability: [
    "Lower carbon emissions",
    "Support ESG initiatives",
    "Achieve Net Zero goals",
    "Enhance corporate reputation",
    "Demonstrate environmental leadership",
  ],
};

const TOTAL = 12;

type PageDef = {
  index: number;
  title: string;
  tone: PageTone;
  render: () => React.ReactNode;
};

function Shell(props: {
  index: number;
  section: string;
  tone?: PageTone;
  children: React.ReactNode;
  className?: string;
  bleed?: React.ReactNode;
}) {
  return <PageShell total={TOTAL} {...props} />;
}

// 01 — Front Cover
function FrontCoverPage() {
  return (
    <div className="page-canvas relative overflow-hidden bg-navy">
      <img
        src={frontCover}
        alt="Commercial Solar eBook Front Cover"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

// 02 — About Zenith Energy + Mission & Vision
function About() {
  return (
    <Shell index={2} section="About Zenith Energy">
      <div className="flex h-full flex-col">
        <Rule />
        <div className="mt-5 grid grid-cols-12 gap-10">
          <div className="col-span-7">
            <h2 className="page-h1 text-navy">
              Powering businesses with
              <br />
              clean energy since 2014
            </h2>
            <div className="mt-5 space-y-4">
              <p className="page-body text-ink">
                Zenith Energy is one of India&apos;s leading Commercial &amp; Industrial (C&amp;I)
                solar EPC companies, helping businesses reduce electricity costs and transition to
                sustainable energy solutions. With over a decade of experience, we design, install,
                and maintain high-performance rooftop and ground-mounted solar power systems
                tailored to commercial and industrial requirements.
              </p>
              <p className="page-body text-ink">
                From manufacturing plants and warehouses to hospitals, hotels, educational
                institutions, IT parks, and commercial buildings, our customized solar solutions
                enable businesses to improve operational efficiency, reduce energy expenses, and
                achieve long-term sustainability goals.
              </p>
              <p className="page-body text-ink">
                Our team manages every stage of the project, from energy assessment and engineering
                design to installation, commissioning, net metering, and long-term
                maintenance—ensuring a seamless experience and maximum return on investment.
              </p>
            </div>
          </div>
          <div className="col-span-5 flex flex-col justify-between gap-2.5">
            <img
              src={rooftopSolar}
              alt="Aerial view of solar panels installed across a commercial rooftop"
              className="h-[210px] w-full rounded-2xl object-cover shadow-card"
            />
            <img
              src={panelDetail}
              alt="Close detail of a photovoltaic solar panel surface"
              loading="lazy"
              className="h-[210px] w-full rounded-2xl object-cover shadow-card"
            />
            <img
              src={facility}
              alt="Commercial solar manufacturing facility and installation"
              loading="lazy"
              className="h-[210px] w-full rounded-2xl object-cover shadow-card"
            />
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-6 pt-6">
          <div className="rounded-2xl bg-navy p-7 text-navy-foreground">
            <span className="page-kicker opacity-70">Our Mission</span>
            <p className="page-body mt-4">
              To empower businesses with innovative solar energy solutions that reduce operating
              costs, enhance energy independence, and accelerate India&apos;s transition toward a
              sustainable future.
            </p>
          </div>
          <div className="rounded-2xl border border-rule p-7 shadow-card">
            <span className="page-kicker text-brand-red">Our Vision</span>
            <p className="page-body mt-4 text-ink">
              To become India&apos;s most trusted commercial solar EPC partner by delivering
              reliable, efficient, and future-ready renewable energy solutions that create lasting
              value for businesses.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// 03 — Why Businesses Are Switching to Solar
function WhySwitching() {
  return (
    <Shell index={3} section="Why Businesses Are Switching">
      <Rule />
      <h2 className="page-h1 mt-8 text-navy">Why businesses are switching to solar</h2>
      <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6">
        {[
          "Electricity is one of the largest recurring operating expenses for commercial and industrial businesses. Every year, electricity tariffs continue to rise, increasing production costs and reducing profit margins.",
          "Businesses today face growing pressure to control expenses while improving sustainability and operational efficiency. Solar energy addresses both challenges by enabling companies to generate their own clean electricity directly from unused rooftop space.",
          "Unlike traditional electricity, solar provides a stable source of power for more than 25 years, allowing businesses to protect themselves from future tariff increases while significantly reducing monthly electricity bills.",
          "Commercial solar also strengthens environmental commitments by lowering carbon emissions and supporting ESG (Environmental, Social, and Governance) initiatives. Companies investing in renewable energy improve their brand reputation while meeting sustainability expectations from customers, investors, and regulatory bodies.",
        ].map((p, idx) => (
          <div key={idx} className="border-t border-rule pt-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-sm font-bold text-navy-foreground shadow-sm">
                {idx + 1}
              </span>
            </div>
            <p className="page-body text-ink">{p}</p>
          </div>
        ))}
      </div>
      <p className="page-lead mt-10 text-navy">
        By adopting commercial solar today, businesses can reduce operating costs, improve
        profitability, and build a more resilient energy future.
      </p>
    </Shell>
  );
}

// 04 — Is Your Business Paying Too Much for Electricity?
function PayingTooMuch() {
  const industries = [
    "Manufacturing Industries",
    "Warehouses and Logistics Centers",
    "Hospitals",
    "Hotels and Resorts",
    "Educational Institutions",
    "IT Parks",
    "Shopping Malls",
    "Food Processing Units",
    "Textile Industries",
    "Pharmaceutical Companies",
    "Automobile Manufacturing",
    "Commercial Office Buildings",
  ];
  return (
    <Shell index={4} section="Electricity Costs">
      <Rule />
      <h2 className="page-h1 mt-8 text-navy">Is your business paying too much for electricity?</h2>
      <p className="page-lead mt-8 max-w-[760px] text-ink">
        Many businesses spend lakhs of rupees every month on electricity. Rising utility bills
        directly affect operating costs, product pricing, and overall profitability.
      </p>
      <p className="page-body mt-6 text-ink-muted">
        Industries that typically consume large amounts of electricity include:
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {industries.map((i) => (
          <div
            key={i}
            className="flex h-20 items-center justify-center rounded-xl border border-rule bg-paper px-4 py-2 text-center text-navy shadow-card"
          >
            <span className="page-small font-medium leading-snug">{i}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-4 border-t border-rule pt-6">
        <p className="page-body text-ink">
          If electricity has become one of your highest monthly expenses, investing in commercial
          solar can provide substantial long-term savings.
        </p>
        <p className="page-body text-ink">
          Instead of paying increasing electricity bills every month, businesses can invest in solar
          once and generate clean electricity for decades.
        </p>
      </div>
    </Shell>
  );
}

// 05 — How Commercial Solar Works
function HowItWorks() {
  return (
    <Shell index={5} section="How Commercial Solar Works" tone="navy">
      <Rule tone="navy" />
      <h2 className="page-h1 mt-8">How commercial solar works</h2>
      <div className="mt-10 space-y-6">
        <p className="page-body opacity-90">
          Commercial solar systems convert sunlight into electricity using high-efficiency
          photovoltaic (PV) panels installed on rooftops or open land.
        </p>
        <p className="page-body opacity-90">
          The electricity generated passes through an inverter, which converts direct current (DC)
          into alternating current (AC) suitable for commercial operations.
        </p>
        <p className="page-body opacity-90">
          This electricity is immediately consumed by the building, factory, or facility. When solar
          production exceeds consumption, surplus electricity is exported to the utility grid
          through a net meter. During periods when solar production is lower, additional electricity
          is imported from the grid.
        </p>
        <p className="page-body opacity-90">
          This intelligent energy management system significantly reduces dependence on conventional
          electricity while maximizing financial savings.
        </p>
      </div>
      <p className="page-small mt-10 opacity-70">
        Depending on business requirements, companies can choose from:
      </p>
      <div className="mt-5 grid grid-cols-3 gap-5">
        {[
          "On-Grid Solar Systems",
          "Off-Grid Solar Systems",
          "Hybrid Solar Systems with Battery Storage",
        ].map((s) => (
          <div key={s} className="rounded-2xl bg-navy-foreground/10 p-7">
            <p className="page-h3">{s}</p>
          </div>
        ))}
      </div>
      <p className="page-body mt-8 opacity-90">
        Zenith Energy helps businesses determine the most suitable solution based on energy
        consumption patterns, operational requirements, and future expansion plans.
      </p>
    </Shell>
  );
}

// 06 — Key Benefits (financial, operational, sustainability)
function KeyBenefits() {
  return (
    <Shell index={6} section="Key Benefits">
      <Rule />
      <h2 className="page-h1 mt-8 text-navy">{SOURCE.title}</h2>
      <p className="page-lead mt-6 max-w-[760px] text-ink">{SOURCE.intro}</p>
      <div className="mt-10 grid grid-cols-3 gap-6">
        <Card title="Financial Benefits" items={SOURCE.financial} />
        <Card title="Operational Benefits" items={SOURCE.operational} />
        <Card title="Sustainability Benefits" items={SOURCE.sustainability} />
      </div>
      <img
        src={facility}
        alt="Production floor of a manufacturing plant"
        width={1408}
        height={1008}
        loading="lazy"
        className="mt-8 h-[280px] w-full rounded-2xl object-cover"
      />
    </Shell>
  );
}

// 07 — ROI
function Roi() {
  const rows: [string, string][] = [
    ["Monthly Electricity Bill", "₹5,00,000"],
    ["Annual Electricity Cost", "₹60,00,000"],
    ["Recommended Solar Plant", "500 kW"],
    ["Estimated Investment", "₹2 Crore"],
    ["Annual Savings", "₹48 Lakh"],
    ["Estimated Payback Period", "4–5 Years"],
    ["Projected Savings Over 25 Years", "More than ₹12 Crore"],
  ];
  return (
    <Shell index={7} section="Return on Investment">
      <Rule />
      <h2 className="page-h1 mt-8 text-navy">Understanding your return on investment (ROI)</h2>
      <p className="page-lead mt-8 text-ink">
        Commercial solar is one of the most profitable long-term investments a business can make.
      </p>
      <p className="page-small mt-6 text-ink-muted">For example:</p>
      <div className="mt-4">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between border-t border-rule py-5"
          >
            <span className="page-body text-ink">{label}</span>
            <span className="page-h3 tabular-nums text-brand-red">{value}</span>
          </div>
        ))}
      </div>
      <p className="page-body mt-8 text-ink">
        After recovering the initial investment, businesses continue generating substantial savings
        for decades, making solar one of the highest-return infrastructure investments available.
      </p>
    </Shell>
  );
}

// 08 — Choosing the right solution: EPC, BOOT, O&M
function Solutions() {
  const models = [
    {
      no: "01",
      title: "Solar EPC (Engineering, Procurement & Construction)",
      body: "Solar EPC is the ideal choice for businesses that want to own their solar power plant and maximize long-term savings. Zenith Energy manages the entire project, from system design and engineering to procurement, installation, testing, and commissioning, ensuring a seamless and hassle-free experience.",
      listTitle: "Benefits",
      items: [
        "End-to-end project execution",
        "Customized system design",
        "High-quality Tier-1 components",
        "Faster project completion",
        "Maximum return on investment",
        "Complete ownership of the solar plant",
        "Reduced electricity costs for 25+ years",
      ],
      best: "Manufacturing industries, commercial buildings, hospitals, hotels, warehouses, educational institutions, and large industrial facilities.",
    },
    {
      no: "02",
      title: "Solar BOOT (Build, Own, Operate & Transfer)",
      body: "The BOOT model allows businesses to enjoy the benefits of solar energy without making a significant upfront investment. Zenith Energy finances, builds, owns, operates, and maintains the solar power plant while the customer purchases electricity at an agreed tariff. At the end of the contract period, ownership of the system is transferred to the customer.",
      listTitle: "Benefits",
      items: [
        "No upfront capital investment",
        "Lower electricity tariffs from day one",
        "Predictable energy costs",
        "Professional operation and maintenance",
        "Reduced financial risk",
        "Transfer of ownership after the agreement period",
      ],
      best: "Businesses looking to reduce electricity costs without investing capital in solar infrastructure.",
    },
    {
      no: "03",
      title: "Solar O&M (Operations & Maintenance)",
      body: "A solar power plant delivers the best results when it is regularly monitored and maintained. Zenith Energy's Operations & Maintenance services ensure your solar system operates at maximum efficiency throughout its lifecycle, maximizing energy generation and protecting your investment.",
      listTitle: "Our O&M services include",
      items: [
        "Preventive and corrective maintenance",
        "Remote system monitoring",
        "Module cleaning and inspection",
        "Inverter health checks",
        "Performance analysis and reporting",
        "Fault detection and quick resolution",
        "Annual maintenance contracts (AMC)",
      ],
      best: "Higher energy generation, improved reliability, reduced downtime, extended equipment lifespan, and maximum return on investment.",
    },
  ];

  return (
    <Shell index={8} section="Choosing the Right Solution">
      <Rule />
      <h2 className="page-h2 mt-6 text-navy">Choosing the right commercial solar solution</h2>
      <div className="mt-6 grid grid-cols-3 gap-5 [&_.page-body]:text-[15px] [&_.page-body]:leading-[1.4] [&_.page-small]:text-[14px] [&_.page-small]:leading-[1.45]">
        {models.map((m) => (
          <div key={m.no} className="flex flex-col rounded-2xl border border-rule p-5 shadow-card">
            <p className="page-kicker text-brand-red">{m.no}</p>
            <h3 className="page-h3 mt-2 text-[20px] text-navy">{m.title}</h3>
            <p className="page-small mt-3 text-ink">{m.body}</p>
            <h4 className="page-kicker mt-4 text-ink-muted">{m.listTitle}</h4>
            <BulletList className="mt-3 space-y-2" items={m.items} />

            <p className="page-small mt-auto border-t border-rule pt-5 text-ink">
              <span className="font-semibold text-navy">
                {m.no === "03" ? "Benefits: " : "Best for: "}
              </span>
              {m.best}
            </p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// 09 — Why Choose Zenith Energy
function WhyZenith() {
  const strengths = [
    "Complete EPC Services",
    "Experienced Engineering Team",
    "Tier-1 Solar Panels",
    "High-Efficiency Inverters",
    "Customized System Design",
    "PAN India Installation",
    "Remote Monitoring",
    "Annual Maintenance Services",
    "Strong Safety Standards",
    "Dedicated Customer Support",
  ];
  return (
    <Shell index={9} section="Why Choose Zenith Energy" tone="navy">
      <Rule tone="navy" />
      <h2 className="page-h1 mt-8">Why choose Zenith Energy?</h2>
      <div className="mt-8 space-y-5">
        <p className="page-body opacity-90">
          Choosing the right EPC partner is just as important as choosing the right solar
          technology.
        </p>
        <p className="page-body opacity-90">
          Zenith Energy combines engineering expertise, premium-quality components, and end-to-end
          project management to deliver reliable commercial solar solutions.
        </p>
      </div>
      <p className="page-small mt-10 opacity-70">Our strengths include:</p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {strengths.map((s) => (
          <div key={s} className="rounded-xl bg-navy-foreground/10 px-6 py-4">
            <p className="page-body">{s}</p>
          </div>
        ))}
      </div>
      <p className="page-body mt-10 opacity-90">
        We focus on delivering systems that maximize energy generation, ensure long-term
        reliability, and provide the highest financial returns.
      </p>
    </Shell>
  );
}

// 10 — Installation Process
function Installation() {
  const steps = [
    "Initial Consultation",
    "Energy Consumption Analysis",
    "Site Survey",
    "Engineering Design",
    "Commercial Proposal",
    "Installation",
    "Testing & Commissioning",
    "Net Metering Approval",
    "System Monitoring",
    "Operations & Maintenance Support",
  ];
  return (
    <Shell index={10} section="Installation Process">
      <Rule />
      <h2 className="page-h1 mt-8 text-navy">Our installation process</h2>
      <p className="page-lead mt-8 text-ink">
        Our streamlined project execution ensures every installation is completed efficiently and
        safely.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-x-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-5 border-t border-rule py-5">
            <span className="page-kicker w-8 flex-none tabular-nums text-brand-red">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="page-body text-navy">{s}</span>
          </div>
        ))}
      </div>
      <p className="page-body mt-8 text-ink">
        Every project is managed by experienced professionals to ensure quality, safety, and timely
        delivery.
      </p>
    </Shell>
  );
}

// 11 — FAQs
function Faqs() {
  const faqs: [string, string][] = [
    [
      "How much roof space is required?",
      "Roof space depends on the system capacity. Approximately 100 square feet is required per kW.",
    ],
    [
      "How long does installation take?",
      "Most commercial projects are completed within 4 to 12 weeks, depending on project size and approvals.",
    ],
    [
      "What is the lifespan of a commercial solar plant?",
      "Modern solar systems are designed to operate efficiently for more than 25 years with minimal maintenance.",
    ],
    [
      "Does solar work during cloudy weather?",
      "Yes. Solar panels continue generating electricity during cloudy conditions, although output may be lower than on sunny days.",
    ],
    [
      "What maintenance is required?",
      "Routine cleaning and periodic inspections are generally sufficient to maintain optimal performance.",
    ],
    [
      "Can the system be expanded later?",
      "Yes. Most commercial systems can be designed with future expansion in mind.",
    ],
  ];
  return (
    <Shell index={11} section="FAQs">
      <Rule />
      <h2 className="page-h1 mt-8 text-navy">Frequently asked questions</h2>
      <div className="mt-10 space-y-5">
        {faqs.map(([q, a]) => (
          <div key={q} className="rounded-2xl border border-rule p-7 shadow-card">
            <h3 className="page-h3 text-navy">{q}</h3>
            <p className="page-body mt-3 text-ink">{a}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// 12 — Back Cover
function BackCoverPage() {
  return (
    <div className="page-canvas relative overflow-hidden bg-navy">
      <img
        src={backCover}
        alt="Commercial Solar eBook Back Cover"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export const PAGES: PageDef[] = [
  { index: 1, title: "Front Cover", tone: "navy", render: FrontCoverPage },
  { index: 2, title: "About Zenith Energy", tone: "paper", render: About },
  { index: 3, title: "Why Businesses Are Switching", tone: "paper", render: WhySwitching },
  { index: 4, title: "Paying Too Much for Electricity?", tone: "paper", render: PayingTooMuch },
  { index: 5, title: "How Commercial Solar Works", tone: "navy", render: HowItWorks },
  { index: 6, title: "Key Benefits", tone: "paper", render: KeyBenefits },
  { index: 7, title: "Return on Investment", tone: "paper", render: Roi },
  { index: 8, title: "Choosing the Right Solution", tone: "paper", render: Solutions },
  { index: 9, title: "Why Choose Zenith Energy", tone: "navy", render: WhyZenith },
  { index: 10, title: "Installation Process", tone: "paper", render: Installation },
  { index: 11, title: "FAQs", tone: "paper", render: Faqs },
  { index: 12, title: "Back Cover", tone: "navy", render: BackCoverPage },
];
