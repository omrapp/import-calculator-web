# Import Calculator

Public web tool for importers into Israel to estimate the full cost of bringing goods in: goods value, shipping, customs duties, taxes and local expenses, all expressed in Shekels (₪).

## Language

### Money

**Base Currency**:
The Israeli Shekel (₪); every amount in a calculation is converted to it.
_Avoid_: Local currency, home currency

**Exchange Rate**:
The ₪ value of one unit of a foreign currency ($ or €) used in a calculation; defaults to the latest Bank of Israel representative rate and may be overridden by the user.
_Avoid_: Currency, FX, conversion

### Calculations

**Calculation**:
One estimate of an import's Landed Cost, made in either Standard or Air Shipment mode.
_Avoid_: Result, estimate, quote

**Standard Calculation**:
Calculation where Freight is entered directly.
_Avoid_: Sea calculation, CIF calculator

**Air Shipment Calculation**:
Calculation where Freight is derived from Cartons, Chargeable Weight and carrier rates.
_Avoid_: Flight calculation, air freight calculator

### Valuation

**CIF**:
Customs value of a shipment: the sum of Cost, Freight and Insurance, in ₪.
_Avoid_: Shipment value, total value

**Cost**:
Price paid to the supplier for the goods, in the supplier's currency.
_Avoid_: Price, goods value, product cost

**Freight**:
Charge for transporting the goods to Israel.
_Avoid_: Shipping, transport

**Insurance**:
Charge for insuring the goods in transit, entered directly or derived from the Premium.

**Premium**:
Insurance rate as a percentage of the goods' value.

### Air shipments

**Carton**:
One packed unit in an air shipment, described by length, width, height, actual weight and quantity.
_Avoid_: Box, package, parcel

**Volumetric Weight**:
Weight billed for a Carton's volume: length × width × height ÷ Divisor.
_Avoid_: Dimensional weight, DIM weight

**Divisor**:
Carrier-specific number that converts a Carton's volume into Volumetric Weight.

**Chargeable Weight**:
The greater of total actual weight and total Volumetric Weight across all Cartons; air Freight is priced on it.
_Avoid_: Billable weight

### Duties and taxes

**Customs Duty**:
Duty charged on CIF when goods enter Israel, as a percentage of CIF.
_Avoid_: Customs tax, tariff, tax (alone)

**Duty Option**:
One of two alternative ₪ duty amounts (Duty Option I and Duty Option II) for goods with a compound duty; the Compound Duty Rule picks which becomes the Customs Duty.
_Avoid_: Tama I, Tama II

**Compound Duty Rule**:
Rule for choosing between Duty Options: Higher (ALF, take the greater) or Lower (ALE, take the smaller).
_Avoid_: Tama type

**Tama**:
Uniform price uplift: a percentage added to CIF plus Customs Duty to form the Purchase Tax base only; never part of Landed Cost.
_Avoid_: Tama %, price addition

**Purchase Tax**:
Additional Israeli tax on specific goods categories, charged on CIF plus Customs Duty plus Tama.
_Avoid_: Custom tax

**VAT**:
Israeli value-added tax charged on the landed total before VAT; 18% by default and editable.

### Expenses

**Expense**:
A local cost paid in Israel to receive the goods, added to Landed Cost after duties and taxes.
_Avoid_: Fee, charge, extra

**Customs Broker Fee**:
Expense paid to the licensed customs agent who clears the goods.
_Avoid_: Tax employees, employee, agent fee

**Custom Expense**:
User-named Expense with its own value and currency, beyond the fixed ones (local transport, bank, broker, other).
_Avoid_: Extra expense, additional item

### Results

**Landed Cost**:
Total cost of the goods once in Israel, before VAT: CIF + Customs Duty + Purchase Tax + Expenses.
_Avoid_: Total, final cost

**Total Including VAT**:
Landed Cost plus VAT.
_Avoid_: Final total, grand total

**Import Factor**:
Landed Cost divided by Cost; shows how much each unit of purchase price grows by the time the goods land.
_Avoid_: Import pivot, pivot 1, multiplier

**Shekel-per-Unit Factor**:
Landed Cost in ₪ divided by Cost in its foreign currency; the ₪ spent per $ or € paid to the supplier.
_Avoid_: Pivot 2

### Records

**Saved Calculation**:
A named, described snapshot of a calculation's inputs and result, stored in the user's browser.
_Avoid_: Bookmark, history item

**History**:
The list of a user's Saved Calculations, newest first.
_Avoid_: Bookmarks
