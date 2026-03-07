import type { Meal, Ingredient } from '../types';

export class RecipeImportService {
    /**
     * Attempts to extract recipe data from a URL.
     * Note: In a real production app, this would typically be handled by a backend
     * to avoid CORS issues and use heavy libraries like Cheerio.
     * For this app, we'll use a public CORS proxy and basic parsing.
     */
    static async importFromUrl(url: string): Promise<Partial<Meal>> {
        try {
            // Use a CORS proxy to fetch the content
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Failed to fetch from proxy');

            const data = await response.json();
            const html = data.contents;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Try to find Recipe Schema (LD+JSON)
            const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
            for (const script of Array.from(scripts)) {
                try {
                    const json = JSON.parse(script.textContent || '{}');
                    const recipe = this.findRecipeObject(json);

                    if (recipe) {
                        return this.mapSchemaToMeal(recipe, url);
                    }
                } catch (e) {
                    continue;
                }
            }

            // Fallback: Simple Meta Tags Parsing
            const title = doc.querySelector('title')?.textContent?.trim() ||
                doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';

            return {
                name: title,
                sourceUrl: url,
                ingredients: [],
                steps: []
            };
        } catch (error) {
            console.error('Recipe import failed:', error);
            throw error;
        }
    }

    private static findRecipeObject(json: any): any {
        const items = Array.isArray(json) ? json : [json];
        for (const item of items) {
            const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
            if (types.some(t => typeof t === 'string' && t.includes('Recipe'))) return item;

            if (item['@graph']) {
                const found = item['@graph'].find((g: any) => {
                    const gTypes = Array.isArray(g['@type']) ? g['@type'] : [g['@type']];
                    return gTypes.some(t => typeof t === 'string' && t.includes('Recipe'));
                });
                if (found) return found;
            }
        }
        return null;
    }

    private static mapSchemaToMeal(recipe: any, url: string): Partial<Meal> {
        // Parse ingredients
        const rawIngredients = recipe.recipeIngredient || recipe.recipeIngredients || recipe.ingredients || [];
        const ingredients: Partial<Ingredient>[] = rawIngredients.map((ing: string) => {
            // Basic parsing of "1 1/2 cups flour" or "2 eggs"
            const qtyMatch = ing.match(/^(\d+[\d\/\.\s]*)\s*(.*)/);
            let quantity = 1;
            let name = ing;
            let unit = 'pcs';

            if (qtyMatch) {
                const rawQty = qtyMatch[1].trim();
                name = qtyMatch[2].trim();

                // Convert fraction or string to number
                try {
                    if (rawQty.includes('/')) {
                        const parts = rawQty.split(' ');
                        let total = 0;
                        parts.forEach(p => {
                            if (p.includes('/')) {
                                const [num, den] = p.split('/');
                                total += parseInt(num) / parseInt(den);
                            } else {
                                total += parseInt(p);
                            }
                        });
                        quantity = total;
                    } else {
                        quantity = parseFloat(rawQty);
                    }
                } catch (e) {
                    quantity = 1;
                }

                // Extract unit if common ones are found
                const commonUnits = ['cup', 'cups', 'tbsp', 'tsp', 'g', 'kg', 'ml', 'l', 'oz', 'lb', 'pound', 'pounds', 'clove', 'cloves'];
                const unitMatch = name.match(/^([a-zA-Z]+)\s+(.*)/);
                if (unitMatch && commonUnits.includes(unitMatch[1].toLowerCase().replace('s$', ''))) {
                    unit = unitMatch[1];
                    name = unitMatch[2];
                }
            }

            return {
                id: crypto.randomUUID(),
                name: name,
                quantity: quantity || 1,
                unit: unit,
                category: 'Other'
            };
        });

        // Parse steps
        let steps: string[] = [];
        const instructions = recipe.recipeInstructions;
        if (Array.isArray(instructions)) {
            steps = instructions.map((step: any) => {
                if (typeof step === 'string') return step;
                if (step.text) return step.text;
                if (step.itemListElement) {
                    return step.itemListElement.map((e: any) => e.text || e).join(' ');
                }
                return '';
            }).filter(s => s);
        } else if (typeof instructions === 'string') {
            steps = [instructions];
        }

        return {
            name: recipe.name || '',
            ingredients: ingredients as any,
            steps: steps,
            sourceUrl: url,
            complexity: 'complex'
        };
    }
}
