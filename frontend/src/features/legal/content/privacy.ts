import type { LegalSection } from "@/features/legal/components/LegalDocument";

export const PRIVACY_LAST_UPDATED = "August 23, 2026";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      "Chronova (\"we,\" \"us,\" or \"our\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, create an account, or make a purchase.",
      "By using our Service, you acknowledge that you have read and understood this Privacy Policy.",
    ],
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    paragraphs: ["We may collect the following categories of information:"],
    list: [
      "Identity data: name, username, date of birth (where required for age verification).",
      "Contact data: email address, phone number, billing and shipping addresses.",
      "Account data: login credentials, preferences, wishlist items, and order history.",
      "Transaction data: payment method details (processed securely by our payment providers), purchase records, and refund history.",
      "Technical data: IP address, browser type, device information, operating system, and usage data collected through cookies and similar technologies.",
      "Communications: messages you send to customer support and feedback you provide.",
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    paragraphs: ["We use personal data to:"],
    list: [
      "Process and fulfil orders, including payment processing and delivery.",
      "Create and manage your account.",
      "Provide customer support and respond to inquiries.",
      "Send transactional communications such as order confirmations and shipping updates.",
      "Send marketing communications where you have opted in (you may unsubscribe at any time).",
      "Improve our website, products, and services through analytics and research.",
      "Detect, prevent, and address fraud, security issues, and legal compliance.",
    ],
  },
  {
    id: "legal-bases",
    title: "4. Legal Bases for Processing",
    paragraphs: [
      "Where applicable under data protection laws such as the GDPR, we process your personal data based on one or more of the following legal bases: performance of a contract, legitimate interests, compliance with legal obligations, and your consent (which you may withdraw at any time).",
    ],
  },
  {
    id: "sharing",
    title: "5. How We Share Information",
    paragraphs: [
      "We do not sell your personal data. We may share information with trusted third parties only as necessary to operate our business:",
    ],
    list: [
      "Payment processors to handle secure transactions.",
      "Shipping and logistics partners to deliver your orders.",
      "Cloud hosting and IT service providers who support our infrastructure.",
      "Analytics providers to help us understand site usage (in aggregated or pseudonymized form where possible).",
      "Legal or regulatory authorities when required by law or to protect our rights.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    paragraphs: [
      "We use cookies and similar technologies to remember your preferences, keep you signed in, analyze traffic, and personalize your experience.",
      "You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of the Service, such as staying logged in or retaining items in your cart.",
    ],
    list: [
      "Essential cookies: required for core site functionality.",
      "Performance cookies: help us understand how visitors use the site.",
      "Functional cookies: remember your preferences and settings.",
      "Marketing cookies: used to deliver relevant promotions (with your consent).",
    ],
  },
  {
    id: "retention",
    title: "7. Data Retention",
    paragraphs: [
      "We retain personal data only for as long as necessary to fulfil the purposes described in this policy, including satisfying legal, accounting, or reporting requirements.",
      "Order and transaction records are typically retained for seven years for tax and compliance purposes. Account data is retained while your account is active and for a reasonable period thereafter.",
    ],
  },
  {
    id: "security",
    title: "8. Data Security",
    paragraphs: [
      "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.",
      "Payment information is processed through PCI-DSS compliant providers and is not stored on our servers in full. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "your-rights",
    title: "9. Your Rights",
    paragraphs: [
      "Depending on your location, you may have the following rights regarding your personal data:",
    ],
    list: [
      "Access: request a copy of the personal data we hold about you.",
      "Correction: request correction of inaccurate or incomplete data.",
      "Deletion: request deletion of your data, subject to legal exceptions.",
      "Restriction: request that we limit how we use your data.",
      "Portability: request a portable copy of your data in a structured format.",
      "Objection: object to processing based on legitimate interests or for direct marketing.",
      "Withdraw consent: where processing is based on consent, withdraw it at any time.",
    ],
  },
  {
    id: "international",
    title: "10. International Transfers",
    paragraphs: [
      "Chronova is based in Switzerland. Your information may be transferred to and processed in countries other than your own. Where required, we implement appropriate safeguards such as standard contractual clauses to protect your data during international transfers.",
    ],
  },
  {
    id: "children",
    title: "11. Children's Privacy",
    paragraphs: [
      "Our Service is not directed to individuals under 18 years of age. We do not knowingly collect personal data from children. If you believe we have collected data from a minor, please contact us and we will take steps to delete it.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top of this page indicates when the policy was last revised. Material changes will be communicated via email or a prominent notice on our website where appropriate.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact Us",
    paragraphs: [
      "For privacy-related questions or to exercise your rights, contact our Data Protection Officer at privacy@chronova.com or write to Chronova, Bahnhofstrasse 1, 8001 Zurich, Switzerland.",
      "If you are located in the European Economic Area or United Kingdom, you also have the right to lodge a complaint with your local data protection authority.",
    ],
  },
];

export const PRIVACY_DESCRIPTION =
  "How Chronova collects, uses, stores, and protects your personal information.";
