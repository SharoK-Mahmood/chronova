import type { LegalSection } from "@/features/legal/components/LegalDocument";

export const TERMS_LAST_UPDATED = "August 23, 2026";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing or using the Chronova website, mobile applications, or any related services (collectively, the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.",
      "We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    paragraphs: [
      "You must be at least 18 years of age to create an account and purchase products through Chronova. By using the Service, you represent that you meet this requirement and that all information you provide is accurate and complete.",
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts & Security",
    paragraphs: [
      "When you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
      "You agree to notify us promptly of any unauthorized use of your account. Chronova is not liable for losses arising from unauthorized access where you have failed to safeguard your credentials.",
    ],
    list: [
      "Provide accurate registration information and keep it up to date.",
      "Use a strong, unique password and enable available security features.",
      "Sign out of shared or public devices after use.",
    ],
  },
  {
    id: "products",
    title: "4. Products & Availability",
    paragraphs: [
      "Chronova offers luxury watches and related timepieces. Product descriptions, images, specifications, and pricing are provided for informational purposes and may be updated without notice.",
      "We make reasonable efforts to display products accurately; however, minor variations in colour, materials, or dimensions may occur. All purchases are subject to availability.",
      "Prices are listed in the currency shown at checkout and may change before an order is confirmed. Chronova reserves the right to limit quantities or refuse orders at its discretion.",
    ],
  },
  {
    id: "orders",
    title: "5. Orders & Payment",
    paragraphs: [
      "Placing an order constitutes an offer to purchase. An order is confirmed only when you receive an order confirmation email from Chronova.",
      "You agree to pay all charges associated with your order, including applicable taxes, duties, and shipping fees. Payment must be received before items are dispatched.",
      "We reserve the right to cancel or refuse any order due to pricing errors, suspected fraud, stock unavailability, or other legitimate business reasons. If your order is cancelled after payment, you will receive a full refund.",
    ],
  },
  {
    id: "shipping",
    title: "6. Shipping & Delivery",
    paragraphs: [
      "Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery to the carrier, except where applicable law provides otherwise.",
      "International orders may be subject to customs duties, import taxes, or fees imposed by the destination country. These charges are the responsibility of the recipient unless stated otherwise at checkout.",
    ],
  },
  {
    id: "returns",
    title: "7. Returns & Refunds",
    paragraphs: [
      "Eligible items may be returned within 30 days of delivery in unused condition with original packaging, tags, and documentation. Customized, engraved, or final-sale items may not be eligible for return.",
      "To initiate a return, contact our customer service team or follow the instructions in your order confirmation. Refunds are processed to the original payment method once the returned item is received and inspected.",
      "Shipping costs on returns may be non-refundable unless the return is due to a defect or error on our part.",
    ],
  },
  {
    id: "intellectual-property",
    title: "8. Intellectual Property",
    paragraphs: [
      "All content on the Service — including text, graphics, logos, images, product photography, and software — is owned by Chronova or its licensors and protected by intellectual property laws.",
      "You may not reproduce, distribute, modify, or create derivative works from any Chronova content without prior written consent.",
    ],
  },
  {
    id: "prohibited",
    title: "9. Prohibited Conduct",
    paragraphs: ["You agree not to:"],
    list: [
      "Use the Service for unlawful purposes or in violation of any applicable laws.",
      "Attempt to gain unauthorized access to our systems, accounts, or data.",
      "Use automated tools to scrape, crawl, or extract data from the Service.",
      "Submit false, misleading, or fraudulent information during checkout or registration.",
      "Interfere with the proper functioning or security of the Service.",
    ],
  },
  {
    id: "disclaimer",
    title: "10. Disclaimers",
    paragraphs: [
      "The Service is provided on an \"as is\" and \"as available\" basis. To the fullest extent permitted by law, Chronova disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
      "We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.",
    ],
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, Chronova and its officers, directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service or purchase of products.",
      "Our total liability for any claim related to the Service shall not exceed the amount you paid to Chronova for the product or service giving rise to the claim in the twelve months preceding the claim.",
    ],
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of Switzerland, without regard to conflict-of-law principles. Any disputes shall be resolved in the courts of Zurich, Switzerland, unless mandatory consumer protection laws in your jurisdiction require otherwise.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact Us",
    paragraphs: [
      "If you have questions about these Terms of Service, please contact us at legal@chronova.com or write to Chronova, Bahnhofstrasse 1, 8001 Zurich, Switzerland.",
    ],
  },
];

export const TERMS_DESCRIPTION =
  "The terms and conditions governing your use of Chronova and purchases made through our platform.";
