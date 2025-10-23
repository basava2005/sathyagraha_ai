import { db } from "./db";
import { templates } from "@shared/schema";

const indianTemplates = [
  {
    name: "Rental Agreement",
    description: "Standard residential rental agreement compliant with Indian tenancy laws",
    category: "rental",
    isActive: true,
    fields: [
      { name: "landlordName", label: "Landlord Name", type: "text", required: true, placeholder: "Full name of landlord" },
      { name: "tenantName", label: "Tenant Name", type: "text", required: true, placeholder: "Full name of tenant" },
      { name: "propertyAddress", label: "Property Address", type: "textarea", required: true, placeholder: "Complete address of property" },
      { name: "monthlyRent", label: "Monthly Rent (₹)", type: "number", required: true, placeholder: "Amount in rupees" },
      { name: "securityDeposit", label: "Security Deposit (₹)", type: "number", required: true, placeholder: "Amount in rupees" },
      { name: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
      { name: "leaseDuration", label: "Lease Duration (months)", type: "number", required: true },
      { name: "landlordAddress", label: "Landlord Address", type: "textarea", required: true },
      { name: "tenantAddress", label: "Tenant Address", type: "textarea", required: true },
    ],
    templateContent: `RENTAL AGREEMENT

This Rental Agreement is made on {{leaseStartDate}} between:

LANDLORD: {{landlordName}}, residing at {{landlordAddress}}

AND

TENANT: {{tenantName}}, residing at {{tenantAddress}}

PROPERTY DETAILS:
The Landlord agrees to rent out the property located at: {{propertyAddress}}

TERMS AND CONDITIONS:

1. RENT: The monthly rent for the property is ₹{{monthlyRent}}, payable on or before the 5th of each month.

2. SECURITY DEPOSIT: The Tenant has paid a security deposit of ₹{{securityDeposit}}, which will be refunded at the end of the tenancy after deducting any dues.

3. LEASE PERIOD: This agreement is valid for {{leaseDuration}} months from {{leaseStartDate}}.

4. MAINTENANCE: The Tenant shall maintain the property in good condition and inform the Landlord of any necessary repairs.

5. TERMINATION: Either party may terminate this agreement by providing 30 days written notice.

6. GOVERNING LAW: This agreement shall be governed by the laws of India.

SIGNATURES:

_____________________          _____________________
Landlord Signature              Tenant Signature

This document is legally binding and compliant with Indian rental laws.`,
  },
  {
    name: "Employment Contract",
    description: "Employment agreement compliant with Indian labor laws and regulations",
    category: "employment",
    isActive: true,
    fields: [
      { name: "companyName", label: "Company Name", type: "text", required: true },
      { name: "employeeName", label: "Employee Name", type: "text", required: true },
      { name: "position", label: "Job Position", type: "text", required: true },
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "salary", label: "Annual Salary (₹)", type: "number", required: true },
      { name: "probationPeriod", label: "Probation Period (months)", type: "number", required: true },
      { name: "workLocation", label: "Work Location", type: "text", required: true },
      { name: "companyAddress", label: "Company Address", type: "textarea", required: true },
    ],
    templateContent: `EMPLOYMENT AGREEMENT

This Employment Agreement is entered into on {{startDate}} between:

EMPLOYER: {{companyName}}, located at {{companyAddress}}

AND

EMPLOYEE: {{employeeName}}

1. POSITION: The Employee is appointed as {{position}}, based at {{workLocation}}.

2. COMMENCEMENT: Employment commences on {{startDate}}.

3. PROBATION: The Employee will be on probation for {{probationPeriod}} months.

4. COMPENSATION: Annual salary of ₹{{salary}}, payable monthly as per company policy.

5. DUTIES: The Employee shall perform duties as assigned and comply with company policies.

6. CONFIDENTIALITY: The Employee agrees to maintain confidentiality of company information.

7. TERMINATION: Either party may terminate employment with 30 days notice during probation, 60 days after confirmation.

8. GOVERNING LAW: This agreement is governed by Indian labor laws including the Industrial Disputes Act, 1947.

ACCEPTED AND AGREED:

_____________________          _____________________
Company Representative         Employee Signature`,
  },
  {
    name: "Sale Deed",
    description: "Property sale deed compliant with the Transfer of Property Act, 1882",
    category: "sale",
    isActive: true,
    fields: [
      { name: "sellerName", label: "Seller Name", type: "text", required: true },
      { name: "buyerName", label: "Buyer Name", type: "text", required: true },
      { name: "propertyDescription", label: "Property Description", type: "textarea", required: true },
      { name: "saleAmount", label: "Sale Amount (₹)", type: "number", required: true },
      { name: "saleDate", label: "Date of Sale", type: "date", required: true },
      { name: "sellerAddress", label: "Seller Address", type: "textarea", required: true },
      { name: "buyerAddress", label: "Buyer Address", type: "textarea", required: true },
    ],
    templateContent: `SALE DEED

This Sale Deed is executed on {{saleDate}} between:

SELLER: {{sellerName}}, residing at {{sellerAddress}}

AND

BUYER: {{buyerName}}, residing at {{buyerAddress}}

WHEREAS the Seller is the absolute owner of the property described below and desires to sell the same to the Buyer.

PROPERTY DESCRIPTION: {{propertyDescription}}

CONSIDERATION: The sale is for a total consideration of ₹{{saleAmount}}, which has been paid by the Buyer to the Seller.

TERMS:
1. The Seller transfers all rights, title, and interest in the property to the Buyer.
2. The property is free from all encumbrances.
3. The Seller warrants peaceful possession to the Buyer.
4. This deed is executed in accordance with the Transfer of Property Act, 1882.

IN WITNESS WHEREOF, the parties have executed this deed on the date mentioned above.

_____________________          _____________________
Seller Signature                Buyer Signature

WITNESSES:
1. _____________________
2. _____________________`,
  },
  {
    name: "Partnership Deed",
    description: "Partnership agreement under the Indian Partnership Act, 1932",
    category: "partnership",
    isActive: true,
    fields: [
      { name: "partner1Name", label: "First Partner Name", type: "text", required: true },
      { name: "partner2Name", label: "Second Partner Name", type: "text", required: true },
      { name: "firmName", label: "Firm Name", type: "text", required: true },
      { name: "businessNature", label: "Nature of Business", type: "text", required: true },
      { name: "partner1Share", label: "First Partner Share (%)", type: "number", required: true },
      { name: "partner2Share", label: "Second Partner Share (%)", type: "number", required: true },
      { name: "capitalContribution", label: "Total Capital (₹)", type: "number", required: true },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true },
    ],
    templateContent: `PARTNERSHIP DEED

This Partnership Deed is made on {{effectiveDate}} between:

PARTNERS:
1. {{partner1Name}} (First Party)
2. {{partner2Name}} (Second Party)

FIRM NAME: {{firmName}}

NATURE OF BUSINESS: {{businessNature}}

TERMS AND CONDITIONS:

1. CAPITAL: Total capital contribution is ₹{{capitalContribution}}.

2. PROFIT SHARING:
   - {{partner1Name}}: {{partner1Share}}%
   - {{partner2Name}}: {{partner2Share}}%

3. MANAGEMENT: Partners shall jointly manage the business.

4. ACCOUNTS: Proper books of accounts shall be maintained.

5. DURATION: This partnership shall continue until mutually dissolved.

6. GOVERNING LAW: This deed is governed by the Indian Partnership Act, 1932.

IN WITNESS WHEREOF:

_____________________          _____________________
{{partner1Name}}                {{partner2Name}}`,
  },
  {
    name: "Loan Agreement",
    description: "Personal loan agreement compliant with Indian contract laws",
    category: "loan",
    isActive: true,
    fields: [
      { name: "lenderName", label: "Lender Name", type: "text", required: true },
      { name: "borrowerName", label: "Borrower Name", type: "text", required: true },
      { name: "loanAmount", label: "Loan Amount (₹)", type: "number", required: true },
      { name: "interestRate", label: "Interest Rate (% per annum)", type: "number", required: true },
      { name: "loanDate", label: "Loan Date", type: "date", required: true },
      { name: "repaymentDate", label: "Repayment Date", type: "date", required: true },
      { name: "lenderAddress", label: "Lender Address", type: "textarea", required: true },
      { name: "borrowerAddress", label: "Borrower Address", type: "textarea", required: true },
    ],
    templateContent: `LOAN AGREEMENT

This Loan Agreement is made on {{loanDate}} between:

LENDER: {{lenderName}}, residing at {{lenderAddress}}

AND

BORROWER: {{borrowerName}}, residing at {{borrowerAddress}}

LOAN TERMS:

1. PRINCIPAL: The Lender agrees to lend ₹{{loanAmount}} to the Borrower.

2. INTEREST: Interest rate of {{interestRate}}% per annum.

3. REPAYMENT: Full repayment due on {{repaymentDate}}.

4. DEFAULT: Failure to repay on time will attract additional interest and legal action.

5. GOVERNING LAW: This agreement is governed by Indian Contract Act, 1872.

ACKNOWLEDGED:

_____________________          _____________________
Lender Signature                Borrower Signature`,
  },
  {
    name: "Affidavit",
    description: "General affidavit format for legal declarations under Indian law",
    category: "affidavit",
    isActive: true,
    fields: [
      { name: "deponentName", label: "Deponent Name", type: "text", required: true },
      { name: "deponentAge", label: "Age", type: "number", required: true },
      { name: "deponentOccupation", label: "Occupation", type: "text", required: true },
      { name: "deponentAddress", label: "Address", type: "textarea", required: true },
      { name: "affidavitDate", label: "Date", type: "date", required: true },
      { name: "affidavitContent", label: "Affidavit Content", type: "textarea", required: true, helpText: "State the facts you are declaring" },
      { name: "place", label: "Place", type: "text", required: true },
    ],
    templateContent: `AFFIDAVIT

I, {{deponentName}}, aged {{deponentAge}} years, occupation {{deponentOccupation}}, residing at {{deponentAddress}}, do hereby solemnly affirm and declare as follows:

{{affidavitContent}}

I, the Deponent above named, do hereby declare that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.

Verified at {{place}} on this {{affidavitDate}}.

_____________________
Deponent Signature

VERIFICATION: I, the deponent, verify that the contents of this affidavit are true to the best of my knowledge and belief.`,
  },
  {
    name: "Power of Attorney",
    description: "General Power of Attorney under the Powers of Attorney Act, 1882",
    category: "legal",
    isActive: true,
    fields: [
      { name: "principalName", label: "Principal Name (Grantor)", type: "text", required: true },
      { name: "agentName", label: "Agent Name (Attorney)", type: "text", required: true },
      { name: "purpose", label: "Purpose of Power", type: "textarea", required: true },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true },
      { name: "expiryDate", label: "Expiry Date (if any)", type: "date", required: false },
      { name: "principalAddress", label: "Principal Address", type: "textarea", required: true },
      { name: "agentAddress", label: "Agent Address", type: "textarea", required: true },
    ],
    templateContent: `POWER OF ATTORNEY

Know all men by these presents that I, {{principalName}}, residing at {{principalAddress}}, do hereby appoint {{agentName}}, residing at {{agentAddress}}, as my true and lawful attorney.

PURPOSE: {{purpose}}

EFFECTIVE DATE: {{effectiveDate}}
EXPIRY DATE: {{expiryDate}}

I hereby grant full power and authority to my attorney to act on my behalf in the matters described above.

This Power of Attorney is executed under the Powers of Attorney Act, 1882.

IN WITNESS WHEREOF:

_____________________          _____________________
Principal Signature             Attorney Signature

WITNESSES:
1. _____________________
2. _____________________`,
  },
  {
    name: "Lease Agreement",
    description: "Commercial lease agreement for business premises",
    category: "property",
    isActive: true,
    fields: [
      { name: "lessorName", label: "Lessor Name", type: "text", required: true },
      { name: "lesseeName", label: "Lessee Name", type: "text", required: true },
      { name: "premisesAddress", label: "Premises Address", type: "textarea", required: true },
      { name: "leaseRent", label: "Monthly Lease Rent (₹)", type: "number", required: true },
      { name: "leasePeriod", label: "Lease Period (years)", type: "number", required: true },
      { name: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
      { name: "securityAmount", label: "Security Amount (₹)", type: "number", required: true },
    ],
    templateContent: `LEASE AGREEMENT

This Lease Agreement is made on {{leaseStartDate}} between:

LESSOR: {{lessorName}}
LESSEE: {{lesseeName}}

PREMISES: {{premisesAddress}}

TERMS:
1. LEASE PERIOD: {{leasePeriod}} years from {{leaseStartDate}}
2. RENT: ₹{{leaseRent}} per month
3. SECURITY: ₹{{securityAmount}} as security deposit
4. USE: For lawful business purposes only
5. MAINTENANCE: Lessee responsible for interior maintenance
6. TERMINATION: As per terms or mutual agreement

GOVERNING LAW: Indian Contract Act, 1872

_____________________          _____________________
Lessor Signature                Lessee Signature`,
  },
  {
    name: "Service Agreement",
    description: "Professional service agreement for consultants and service providers",
    category: "employment",
    isActive: true,
    fields: [
      { name: "clientName", label: "Client Name", type: "text", required: true },
      { name: "serviceName", label: "Service Provider Name", type: "text", required: true },
      { name: "servicesDescription", label: "Services Description", type: "textarea", required: true },
      { name: "serviceFee", label: "Service Fee (₹)", type: "number", required: true },
      { name: "serviceStartDate", label: "Start Date", type: "date", required: true },
      { name: "serviceDuration", label: "Duration (months)", type: "number", required: true },
    ],
    templateContent: `SERVICE AGREEMENT

This Agreement is entered into on {{serviceStartDate}} between:

CLIENT: {{clientName}}
SERVICE PROVIDER: {{serviceName}}

SERVICES: {{servicesDescription}}

TERMS:
1. DURATION: {{serviceDuration}} months from {{serviceStartDate}}
2. FEE: ₹{{serviceFee}} for the services
3. DELIVERABLES: As mutually agreed
4. CONFIDENTIALITY: Both parties agree to maintain confidentiality
5. TERMINATION: 15 days written notice

GOVERNING LAW: Indian Contract Act, 1872

_____________________          _____________________
Client Signature                Service Provider`,
  },
  {
    name: "Non-Disclosure Agreement (NDA)",
    description: "Confidentiality agreement to protect sensitive business information",
    category: "nda",
    isActive: true,
    fields: [
      { name: "disclosingParty", label: "Disclosing Party", type: "text", required: true },
      { name: "receivingParty", label: "Receiving Party", type: "text", required: true },
      { name: "purpose", label: "Purpose", type: "textarea", required: true },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true },
      { name: "duration", label: "Duration (years)", type: "number", required: true },
    ],
    templateContent: `NON-DISCLOSURE AGREEMENT

This NDA is made on {{effectiveDate}} between:

DISCLOSING PARTY: {{disclosingParty}}
RECEIVING PARTY: {{receivingParty}}

PURPOSE: {{purpose}}

TERMS:
1. CONFIDENTIAL INFORMATION: All information shared is confidential
2. OBLIGATIONS: Receiving Party shall not disclose to third parties
3. DURATION: {{duration}} years from {{effectiveDate}}
4. RETURN OF INFORMATION: Upon request or termination
5. GOVERNING LAW: Indian Contract Act, 1872

_____________________          _____________________
Disclosing Party               Receiving Party`,
  },
  {
    name: "Will/Testament",
    description: "Last Will and Testament under Indian Succession Act, 1925",
    category: "will",
    isActive: true,
    fields: [
      { name: "testatorName", label: "Testator Name", type: "text", required: true },
      { name: "testatorAge", label: "Age", type: "number", required: true },
      { name: "testatorAddress", label: "Address", type: "textarea", required: true },
      { name: "executorName", label: "Executor Name", type: "text", required: true },
      { name: "beneficiaries", label: "Beneficiaries and Bequests", type: "textarea", required: true, helpText: "List beneficiaries and what they will receive" },
      { name: "willDate", label: "Date", type: "date", required: true },
    ],
    templateContent: `LAST WILL AND TESTAMENT

I, {{testatorName}}, aged {{testatorAge}} years, residing at {{testatorAddress}}, being of sound mind and memory, do hereby make this my Last Will and Testament.

1. EXECUTOR: I appoint {{executorName}} as the Executor of this Will.

2. REVOCATION: I hereby revoke all former Wills and Codicils made by me.

3. BEQUESTS:
{{beneficiaries}}

4. RESIDUARY: All remaining property to be distributed as per law.

IN WITNESS WHEREOF, I have set my hand on this {{willDate}}.

_____________________
Testator Signature

WITNESSES:
1. _____________________
2. _____________________

This Will is made under the Indian Succession Act, 1925.`,
  },
  {
    name: "Gift Deed",
    description: "Gift deed for transfer of property as gift under Transfer of Property Act",
    category: "property",
    isActive: true,
    fields: [
      { name: "donorName", label: "Donor Name (Giver)", type: "text", required: true },
      { name: "doneeName", label: "Donee Name (Receiver)", type: "text", required: true },
      { name: "giftDescription", label: "Gift Description", type: "textarea", required: true },
      { name: "giftValue", label: "Approximate Value (₹)", type: "number", required: true },
      { name: "giftDate", label: "Date of Gift", type: "date", required: true },
      { name: "donorAddress", label: "Donor Address", type: "textarea", required: true },
      { name: "doneeAddress", label: "Donee Address", type: "textarea", required: true },
    ],
    templateContent: `GIFT DEED

This Gift Deed is executed on {{giftDate}} between:

DONOR: {{donorName}}, residing at {{donorAddress}}

AND

DONEE: {{doneeName}}, residing at {{doneeAddress}}

WHEREAS the Donor, out of natural love and affection, desires to gift the following to the Donee:

GIFT DESCRIPTION: {{giftDescription}}
APPROXIMATE VALUE: ₹{{giftValue}}

The Donor hereby transfers all rights, title, and interest in the gift to the Donee with immediate effect.

This deed is executed under the Transfer of Property Act, 1882.

IN WITNESS WHEREOF:

_____________________          _____________________
Donor Signature                 Donee Signature

WITNESSES:
1. _____________________
2. _____________________`,
  },
];

export async function seedTemplates() {
  console.log("Seeding templates...");
  
  for (const template of indianTemplates) {
    try {
      await db.insert(templates).values(template);
      console.log(`✓ Seeded: ${template.name}`);
    } catch (error) {
      console.log(`✗ Error seeding ${template.name}:`, error);
    }
  }
  
  console.log("Template seeding complete!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTemplates()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}
