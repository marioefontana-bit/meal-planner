export class PriceScraperService {
    // We use a CORS proxy because Carrefour's servers don't allow cross-origin requests directly from a browser.
    private static PROXY_URL = 'https://corsproxy.io/?url=';

    /**
     * Attempts to extract the price from a given Carrefour URL
     */
    static async scrapePrice(url: string): Promise<number | null> {
        try {
            // Validate it's a carrefour link
            if (!url.toLowerCase().includes('carrefour.com.ar')) {
                throw new Error('Only carrefour.com.ar URLs are currently supported.');
            }

            const fetchUrl = `${this.PROXY_URL}${encodeURIComponent(url)}`;
            const response = await fetch(fetchUrl);
            
            if (!response.ok) {
                console.error('Failed to fetch URL through proxy', response.status);
                return null;
            }

            const html = await response.text();
            
            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Find JSON-LD scripts which often contain structured product data
            const scriptTags = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
            for (const script of scriptTags) {
                try {
                    const parsed = JSON.parse(script.textContent || '{}');
                    // VTEX stores it in offers array sometimes
                    if (parsed.offers && parsed.offers.price) {
                        return parseFloat(parsed.offers.price);
                    }
                    if (parsed.offers && parsed.offers.offers && parsed.offers.offers[0] && parsed.offers.offers[0].price) {
                         return parseFloat(parsed.offers.offers[0].price);
                    }
                } catch (e) {
                    continue; // Skip invalid JSON
                }
            }

            // Approach 2: Look for common VTEX/Carrefour CSS classes if JSON-LD fails.
            const integerPart = doc.querySelector('.valtech-carrefourar-product-price-0-x-currencyInteger');
            const fractionPart = doc.querySelector('.valtech-carrefourar-product-price-0-x-currencyFraction');
            
            if (integerPart) {
                let priceStr = integerPart.textContent || '0';
                // Remove formatting like commas/dots depending on locale
                priceStr = priceStr.replace(/\./g, '').replace(/,/g, '');
                
                if (fractionPart) {
                     priceStr += '.' + (fractionPart.textContent || '00');
                }
                
                const finalPrice = parseFloat(priceStr);
                if (!isNaN(finalPrice) && finalPrice > 0) return finalPrice;
            }

            // Approach 3: Meta tags fallback
            const metaPrice = doc.querySelector('meta[property="product:price:amount"]');
            if (metaPrice) {
                 const p = parseFloat(metaPrice.getAttribute('content') || '0');
                 if (!isNaN(p) && p > 0) return p;
            }

            console.warn('Could not find a price in the provided Carrefour URL.');
            return null;

        } catch (error) {
            console.error('Error scraping price:', error);
            throw error;
        }
    }
}
