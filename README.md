
## Overview

This is a PROOF OF CONCEPT is designed to help you create a reusable template for rendering banners across multiple locales in a Contentstack-powered site. Although there are no content models here, this just renders an entry that has a "file" field that is multiple. The code is modular and can be extended to support additional components, models, or page layouts.

## Key Files

- [`app/template/page.tsx`](https://github.com/nicknguyen-cs/iHerbDemo-/blob/main/app/template/page.tsx)  
  This is the main template page. It pulls live preview data and currently supports rendering banner images for all locales. It can be extended to support different content types and layouts.

- [`lib/contentstack.ts`](https://github.com/nicknguyen-cs/iHerbDemo-/blob/main/lib/contentstack.ts)  
  Contains Contentstack API requests.  
  The `getDataForTemplate()` function:
  - Fetches all supported locales
  - Retrieves data for the current page using the Live Preview context passed in the request

## Disclaimer

The code provided herein is intended solely for demonstration and proof-of-concept
 purposes. It is NOT intended for production use, nor should it be used in any environment or application where its failure or misbehavior could lead to direct or indirect harm, loss, or damage.
Users are strongly advised to thoroughly review, test, and, if necessary, modify the code before considering its use in any real-world or production scenario.
By using or implementing this code, you acknowledge and accept all risks associated with its use and agree to hold harmless the author(s) or provider(s) from any and all claims, damages, or liabilities.
