"""
Notice Generator Agent

Drafts formal, legally grounded dispute notices, representations, and 
grievance petitions for Indian statutory forums (Parivahan / Virtual Court, 
NCH Consumer Forum, eDaakhil, and Legal Metrology Department).
"""

from typing import Dict, Any
from datetime import datetime


def generate_dispute_notice(
    category: str,
    metadata: Dict[str, Any],
    user_name: str = "Aggrieved Citizen",
    user_address: str = "India",
    dispute_reason: str = ""
) -> Dict[str, str]:
    """
    Generates a structured, legally formal dispute representation tailored to the category.
    """
    today_str = datetime.now().strftime("%d-%m-%Y")
    doc_type = metadata.get("document_type", "Notice")
    fine_amount = metadata.get("fine_amount") or "Applicable Penalty"
    challan_no = metadata.get("challan_number") or "N/A"
    date_of_incident = metadata.get("date") or today_str
    location = metadata.get("location") or "Designated Jurisdiction"
    vehicle_no = metadata.get("vehicle_number") or "[Vehicle Number Withheld]"
    offence = metadata.get("offence_type") or "Alleged Violation"
    merchant = metadata.get("merchant_name") or "Opposite Party / Merchant"
    summary = metadata.get("summary") or ""

    if category == "traffic_challan":
        subject = f"FORMAL REPRESENTATION & OBJECTION AGAINST E-CHALLAN NO: {challan_no}"
        statutes = "Sections 129, 130, 194D and 208 of The Motor Vehicles Act, 1988 (as amended)"
        forum = "To:\nThe Traffic Police Grievance Cell / Virtual Court Magistrate\nDepartment of Transport, Govt. of NCT / State Jurisdiction"
        
        body = f"""{forum}

Date: {today_str}

SUBJECT: {subject}
Vehicle Ref: {vehicle_no} | Date of Alleged Incident: {date_of_incident}

Respected Sir/Madam,

I, the undersigned ({user_name}), registered owner / lawful driver of the vehicle bearing registration number {vehicle_no}, hereby formally register my objection and representation against the issuance of e-Challan No. {challan_no} alleging '{offence}' with a penalty demand of {fine_amount}.

1. FACTUAL DISCREPANCY:
The automated electronic enforcement record generated on {date_of_incident} at {location} contains factual and technical infirmities. {dispute_reason or summary or "The captured photographic/video evidence fails to conclusively establish the alleged non-compliance beyond reasonable doubt."}

2. STATUTORY COMPLIANCE & LEGAL GROUNDS:
Under the provisions of {statutes}, automated speed and traffic detection records must satisfy mandatory calibration standards and clear evidentiary threshold before punitive compounding:
   (a) Section 136A of the Motor Vehicles (Amendment) Act mandates that electronic monitoring must produce clear, unambiguous imaging of the actual driver and vehicle.
   (b) The camera angle / capture does not establish personal culpability as required by law.
   (c) The compounding amount claimed ({fine_amount}) does not account for statutory waivers or verification procedures.

3. PRAYER / RELIEF SOUGHT:
In light of the aforesaid facts and legal provisions, I respectfully request the Competent Authority to:
   (i) Review and re-verify the primary optical / calibration evidence associated with Challan No. {challan_no}.
   (ii) Cancel/revoke the impugned challan or remit the compounding fee.
   (iii) In the alternative, refer the matter to the Special Virtual Court / Lok Adalat for an opportunity of personal hearing in accordance with natural justice.

Yours faithfully,

____________________________
{user_name}
Mobile / Email: [Masked on Record]
Address: {user_address}
"""

    elif category == "mrp_overcharging":
        subject = f"STATUTORY GRIEVANCE NOTICE UNDER SECTION 36 OF THE LEGAL METROLOGY ACT, 2009"
        statutes = "Section 36(1) of the Legal Metrology Act, 2009 read with Legal Metrology (Packaged Commodities) Rules, 2011"
        forum = f"To:\n1. The Grievance Officer, {merchant}\n2. The Controller of Legal Metrology / National Consumer Helpline (NCH)"
        
        body = f"""{forum}

Date: {today_str}

SUBJECT: {subject}
Merchant / Retailer: {merchant} | Location: {location} | Date: {date_of_incident}

Sir/Madam,

I am addressing this formal statutory notice regarding an unlawful price markup and unfair trade practice committed at {location} on {date_of_incident}.

1. PARTICULARS OF VIOLATION:
A packaged commodity was sold by {merchant} demanding an amount in excess of the Maximum Retail Price (MRP) printed on the package. Total transaction amount / penalty claim: {fine_amount}. {dispute_reason or summary or "The cashier/retailer refused to bill the item at the mandated maximum retail price."}

2. VIOLATION OF STATUTORY LAW:
Under {statutes}:
   (a) No person shall manufacture, pack, import, sell, offer, expose or produce for sale any pre-packaged commodity at a price higher than the declared retail sale price.
   (b) Any overcharging above MRP constitutes a cognizable offense punishable under Section 36(1) with fine up to ₹25,000 for the first offence.
   (c) Such practice also constitutes an Unfair Trade Practice under Section 2(47) of the Consumer Protection Act, 2019.

3. REQUISITION:
You are hereby called upon to immediately refund the excess charged amount and tender an acknowledgment within 7 (seven) days of receipt of this notice, failing which this matter shall be formally prosecuted before the District Consumer Disputes Redressal Commission and the State Legal Metrology Department.

Yours sincerely,

____________________________
{user_name}
{user_address}
"""

    else: # refund or consumer_dispute
        subject = f"LEGAL NOTICE FOR DEFICIENCY IN SERVICE & REFUND DENIAL (CONSUMER PROTECTION ACT, 2019)"
        statutes = "Sections 2(11), 2(47), and Section 35 of the Consumer Protection Act, 2019"
        forum = f"To:\nThe Customer Grievance Redressal Officer / Nodal Authority\n{merchant}"
        
        body = f"""{forum}

Date: {today_str}

SUBJECT: {subject}
Order / Transaction Ref: {challan_no} | Disputed Amount: {fine_amount}

Dear Sir/Madam,

This legal notice is served upon you on behalf of the consumer ({user_name}) regarding wrongful denial/delay of refund and deficiency in service with respect to transaction/order reference {challan_no} dated {date_of_incident}.

1. STATEMENT OF FACTS:
The consumer purchased goods/services from {merchant} at {location}. {dispute_reason or summary or "Despite timely cancellation / returned product / service deficiency, the opposite party has unlawfully withheld the refund amount of " + fine_amount + " causing wrongful loss and harassment."}

2. LEGAL VIOLATIONS:
Your conduct squarely attracts the provisions of {statutes}:
   (a) Section 2(11) defines 'Deficiency' as any fault, imperfection, or shortcoming in the quality, quantity, or manner of performance required by law or contract.
   (b) The arbitrary withholding of consumer funds constitutes an 'Unfair Trade Practice' under Section 2(47).
   (c) Under E-Commerce Rules (2020), automated refunds must be credited within statutory timelines without unjustified deductions.

3. DEMAND:
You are hereby called upon to:
   (i) Credit the full pending refund of {fine_amount} along with statutory interest @ 9% p.a. within 15 (fifteen) days from receipt of this notice.
   (ii) Compensate the consumer for administrative harassment and delay.

Take notice that if you fail to comply within the stipulated 15-day window, a formal consumer complaint will be filed through the eDaakhil portal (edaakhil.nic.in) before the competent District Consumer Disputes Redressal Commission, holding you liable for all legal costs.

Yours faithfully,

____________________________
{user_name}
{user_address}
"""

    return {
        "title": subject,
        "category": category,
        "statutes": statutes,
        "notice_text": body
    }
