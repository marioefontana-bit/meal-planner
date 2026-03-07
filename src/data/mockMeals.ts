import type { Meal } from '../types';

export const mockMeals: Meal[] = [
    {
        id: '1',
        name: 'Grilled Chicken Salad',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['gluten-free', 'paleo'],
        nutrition: { calories: 450, protein: 45, carbs: 12, fat: 20 },
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sourceUrl: 'https://www.allrecipes.com/recipe/223382/grilled-chicken-salad/',
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 200, unit: 'g', category: 'Meat', priceEstimate: 3.5 },
            { id: 'i2', name: 'Mixed Greens', quantity: 100, unit: 'g', category: 'Produce', priceEstimate: 1.5 },
            { id: 'i3', name: 'Cherry Tomatoes', quantity: 8, unit: 'pcs', category: 'Produce', priceEstimate: 1.0 },
            { id: 'i4', name: 'Olive Oil', quantity: 1, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.2 },
        ]
    },
    {
        id: '2',
        name: 'Spaghetti Bolognese',
        type: ['dinner'],
        complexity: 'complex',
        isLeftoverFriendly: true,
        nutrition: { calories: 700, protein: 30, carbs: 80, fat: 25 },
        sourceUrl: 'https://www.allrecipes.com/recipe/158140/spaghetti-bolognese/',
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 250, unit: 'g', category: 'Meat', priceEstimate: 4.0 },
            { id: 'i6', name: 'Spaghetti', quantity: 150, unit: 'g', category: 'Pantry', priceEstimate: 0.8 },
            { id: 'i7', name: 'Tomato Sauce', quantity: 200, unit: 'ml', category: 'Pantry', priceEstimate: 1.2 },
            { id: 'i8', name: 'Onion', quantity: 1, unit: 'pcs', category: 'Produce', priceEstimate: 0.5 },
        ]
    },
    {
        id: '3',
        name: 'Vegetable Stir Fry',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['vegan', 'vegetarian'],
        nutrition: { calories: 350, protein: 12, carbs: 45, fat: 10 },
        sourceUrl: 'https://www.allrecipes.com/recipe/222315/vegetable-stir-fry/',
        ingredients: [
            { id: 'i9', name: 'Tofu', quantity: 200, unit: 'g', category: 'Dairy/Plant', priceEstimate: 2.0 },
            { id: 'i10', name: 'Bell Peppers', quantity: 2, unit: 'pcs', category: 'Produce', priceEstimate: 1.5 },
            { id: 'i11', name: 'Broccoli', quantity: 1, unit: 'head', category: 'Produce', priceEstimate: 1.5 },
            { id: 'i12', name: 'Soy Sauce', quantity: 2, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.3 },
        ]
    },
    {
        id: '4',
        name: 'Salmon with Asparagus',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['pescatarian', 'gluten-free', 'keto'],
        nutrition: { calories: 550, protein: 40, carbs: 8, fat: 35 },
        sourceUrl: 'https://www.allrecipes.com/recipe/199540/salmon-with-asparagus/',
        ingredients: [
            { id: 'i13', name: 'Salmon Fillet', quantity: 200, unit: 'g', category: 'Fish', priceEstimate: 8.0 },
            { id: 'i14', name: 'Asparagus', quantity: 1, unit: 'bunch', category: 'Produce', priceEstimate: 3.0 },
            { id: 'i15', name: 'Lemon', quantity: 1, unit: 'pcs', category: 'Produce', priceEstimate: 0.5 },
        ]
    },
    {
        id: '5',
        name: 'Beef Tacos',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        nutrition: { calories: 600, protein: 25, carbs: 50, fat: 30 },
        sourceUrl: 'https://www.foodnetwork.com/recipes/ree-drummond/beef-tacos-recipe-2014660',
        ingredients: [
            { id: 'i16', name: 'Tortillas', quantity: 4, unit: 'pcs', category: 'Pantry', priceEstimate: 1.0 },
            { id: 'i5', name: 'Ground Beef', quantity: 200, unit: 'g', category: 'Meat', priceEstimate: 3.2 },
            { id: 'i17', name: 'Cheese', quantity: 100, unit: 'g', category: 'Dairy', priceEstimate: 2.0 },
            { id: 'i18', name: 'Salsa', quantity: 4, unit: 'tbsp', category: 'Pantry', priceEstimate: 1.0 },
        ]
    },
    {
        id: '6',
        name: 'Mediterranean Baked Chicken',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['gluten-free'],
        nutrition: { calories: 380, protein: 42, carbs: 5, fat: 18 },
        sourceUrl: 'https://www.allrecipes.com/recipe/242277/easy-mediterranean-baked-chicken-breasts/',
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 500, unit: 'g', category: 'Meat', priceEstimate: 7.0 },
            { id: 'i4', name: 'Olive Oil', quantity: 2, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.4 },
            { id: 'i15', name: 'Lemon Juice', quantity: 2, unit: 'tbsp', category: 'Produce', priceEstimate: 0.3 },
            { id: 'i19', name: 'Garlic', quantity: 3, unit: 'cloves', category: 'Produce', priceEstimate: 0.2 },
            { id: 'i20', name: 'Oregano', quantity: 1, unit: 'tsp', category: 'Pantry', priceEstimate: 0.1 },
        ]
    },
    {
        id: '7',
        name: 'Asian Tofu Stir-Fry',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['vegan', 'vegetarian'],
        nutrition: { calories: 320, protein: 18, carbs: 25, fat: 15 },
        sourceUrl: 'https://www.allrecipes.com/recipe/246479/low-cal-vegan-asian-style-tofu-vegetable-stir-fry/',
        ingredients: [
            { id: 'i9', name: 'Tofu', quantity: 300, unit: 'g', category: 'Dairy/Plant', priceEstimate: 3.0 },
            { id: 'i10', name: 'Bell Peppers', quantity: 1, unit: 'pcs', category: 'Produce', priceEstimate: 0.7 },
            { id: 'i21', name: 'Carrots', quantity: 2, unit: 'pcs', category: 'Produce', priceEstimate: 0.4 },
            { id: 'i22', name: 'Green Beans', quantity: 100, unit: 'g', category: 'Produce', priceEstimate: 1.0 },
            { id: 'i12', name: 'Soy Sauce', quantity: 3, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.4 },
        ]
    },
    {
        id: '8',
        name: 'Greek Lemon Chicken Bake',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        nutrition: { calories: 520, protein: 35, carbs: 40, fat: 22 },
        sourceUrl: 'https://www.allrecipes.com/recipe/242352/greek-lemon-chicken-and-potato-prep/',
        ingredients: [
            { id: 'i23', name: 'Chicken Thighs', quantity: 4, unit: 'pcs', category: 'Meat', priceEstimate: 6.0 },
            { id: 'i24', name: 'Potatoes', quantity: 4, unit: 'pcs', category: 'Produce', priceEstimate: 2.0 },
            { id: 'i15', name: 'Lemon Juice', quantity: 4, unit: 'tbsp', category: 'Produce', priceEstimate: 0.6 },
            { id: 'i19', name: 'Garlic', quantity: 4, unit: 'cloves', category: 'Produce', priceEstimate: 0.3 },
        ]
    },
    {
        id: '9',
        name: 'Mushroom Tortellini Alfredo',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['vegetarian'],
        nutrition: { calories: 650, protein: 22, carbs: 70, fat: 35 },
        sourceUrl: 'https://www.allrecipes.com/recipe/232490/lighter-mushroom-tortellini-alfredo/',
        ingredients: [
            { id: 'i25', name: 'Cheese Tortellini', quantity: 500, unit: 'g', category: 'Pantry', priceEstimate: 5.0 },
            { id: 'i26', name: 'Mushrooms', quantity: 250, unit: 'g', category: 'Produce', priceEstimate: 2.5 },
            { id: 'i17', name: 'Parmesan Cheese', quantity: 50, unit: 'g', category: 'Dairy', priceEstimate: 1.5 },
            { id: 'i27', name: 'Milk', quantity: 200, unit: 'ml', category: 'Dairy', priceEstimate: 0.5 },
        ]
    },
    {
        id: '10',
        name: 'Beef and Cheddar Casserole',
        type: ['dinner'],
        complexity: 'complex',
        isLeftoverFriendly: true,
        nutrition: { calories: 580, protein: 32, carbs: 45, fat: 28 },
        sourceUrl: 'https://www.foodnetwork.com/recipes/food-network-kitchen/beef-and-cheddar-casserole-3363321',
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 500, unit: 'g', category: 'Meat', priceEstimate: 8.0 },
            { id: 'i17', name: 'Cheddar Cheese', quantity: 200, unit: 'g', category: 'Dairy', priceEstimate: 3.5 },
            { id: 'i28', name: 'Egg Noodles', quantity: 250, unit: 'g', category: 'Pantry', priceEstimate: 1.5 },
            { id: 'i7', name: 'Tomato Paste', quantity: 2, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.5 },
        ]
    },
    {
        id: '11',
        name: 'Perfect Beef Chili',
        type: ['dinner'],
        complexity: 'complex',
        isLeftoverFriendly: true,
        tags: ['gluten-free'],
        nutrition: { calories: 450, protein: 28, carbs: 20, fat: 30 },
        videoUrl: 'https://www.youtube.com/watch?v=0W8o16VvI1w',
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 1, unit: 'kg', category: 'Meat', priceEstimate: 15.0 },
            { id: 'i29', name: 'Chili Powder', quantity: 2, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.5 },
            { id: 'i30', name: 'Cumin', quantity: 1, unit: 'tsp', category: 'Pantry', priceEstimate: 0.2 },
            { id: 'i7', name: 'Tomato Sauce', quantity: 500, unit: 'g', category: 'Pantry', priceEstimate: 2.5 },
        ]
    },
    {
        id: '12',
        name: 'Tofu Spinach Wrap',
        type: ['lunch'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['vegetarian'],
        nutrition: { calories: 410, protein: 20, carbs: 35, fat: 22 },
        ingredients: [
            { id: 'i16', name: 'Tortillas', quantity: 1, unit: 'pcs', category: 'Pantry', priceEstimate: 0.3 },
            { id: 'i9', name: 'Baked Tofu', quantity: 100, unit: 'g', category: 'Dairy/Plant', priceEstimate: 1.5 },
            { id: 'i31', name: 'Spinach', quantity: 50, unit: 'g', category: 'Produce', priceEstimate: 0.8 },
            { id: 'i17', name: 'Cheese', quantity: 30, unit: 'g', category: 'Dairy', priceEstimate: 0.6 },
        ]
    },
    {
        id: '13',
        name: 'Chickpea Tacos',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['vegan', 'vegetarian', 'gluten-free'],
        nutrition: { calories: 380, protein: 12, carbs: 55, fat: 12 },
        ingredients: [
            { id: 'i32', name: 'Canned Chickpeas', quantity: 400, unit: 'g', category: 'Pantry', priceEstimate: 1.2 },
            { id: 'i5', name: 'Taco Seasoning', quantity: 1, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.3 },
            { id: 'i16', name: 'Corn Tortillas', quantity: 3, unit: 'pcs', category: 'Pantry', priceEstimate: 0.6 },
            { id: 'i33', name: 'Avocado', quantity: 0.5, unit: 'pcs', category: 'Produce', priceEstimate: 1.5 },
        ]
    },
    {
        id: '14',
        name: 'Hamburger Stroganoff',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        nutrition: { calories: 620, protein: 30, carbs: 40, fat: 38 },
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 500, unit: 'g', category: 'Meat', priceEstimate: 8.0 },
            { id: 'i26', name: 'Mushrooms', quantity: 200, unit: 'g', category: 'Produce', priceEstimate: 2.0 },
            { id: 'i34', name: 'Sour Cream', quantity: 150, unit: 'ml', category: 'Dairy', priceEstimate: 1.5 },
            { id: 'i28', name: 'Egg Noodles', quantity: 250, unit: 'g', category: 'Pantry', priceEstimate: 1.5 },
        ]
    },
    {
        id: '15',
        name: 'Garlic Chicken Stir-Fry',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        nutrition: { calories: 350, protein: 38, carbs: 15, fat: 12 },
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 400, unit: 'g', category: 'Meat', priceEstimate: 5.5 },
            { id: 'i19', name: 'Garlic', quantity: 5, unit: 'cloves', category: 'Produce', priceEstimate: 0.3 },
            { id: 'i11', name: 'Broccoli', quantity: 300, unit: 'g', category: 'Produce', priceEstimate: 2.0 },
            { id: 'i12', name: 'Soy Sauce', quantity: 2, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.3 },
        ]
    },
    {
        id: '16',
        name: 'Balsamic Chicken with Tomatoes',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['gluten-free', 'keto'],
        nutrition: { calories: 420, protein: 44, carbs: 10, fat: 22 },
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 400, unit: 'g', category: 'Meat', priceEstimate: 5.5 },
            { id: 'i3', name: 'Cherry Tomatoes', quantity: 200, unit: 'g', category: 'Produce', priceEstimate: 2.0 },
            { id: 'i35', name: 'Balsamic Vinegar', quantity: 3, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.6 },
            { id: 'i4', name: 'Olive Oil', quantity: 1, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.2 },
        ]
    },
    {
        id: '17',
        name: 'Pan-Roasted Chicken',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        nutrition: { calories: 350, protein: 45, carbs: 0, fat: 18 },
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 2, unit: 'pcs', category: 'Meat', priceEstimate: 4.5 },
            { id: 'i4', name: 'Olive Oil', quantity: 1, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.2 },
            { id: 'i36', name: 'Fresh Thyme', quantity: 3, unit: 'sprigs', category: 'Produce', priceEstimate: 1.0 },
        ]
    },
    {
        id: '18',
        name: 'Quick Black Bean Burritos',
        type: ['lunch'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['vegetarian'],
        nutrition: { calories: 480, protein: 18, carbs: 65, fat: 15 },
        ingredients: [
            { id: 'i37', name: 'Black Beans', quantity: 400, unit: 'g', category: 'Pantry', priceEstimate: 1.0 },
            { id: 'i16', name: 'Tortillas', quantity: 2, unit: 'pcs', category: 'Pantry', priceEstimate: 0.6 },
            { id: 'i18', name: 'Salsa', quantity: 100, unit: 'g', category: 'Pantry', priceEstimate: 0.8 },
            { id: 'i17', name: 'Cheese', quantity: 50, unit: 'g', category: 'Dairy', priceEstimate: 1.0 },
        ]
    },
    {
        id: '19',
        name: 'Summer Linguine',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['vegetarian'],
        nutrition: { calories: 510, protein: 15, carbs: 75, fat: 18 },
        ingredients: [
            { id: 'i38', name: 'Linguine', quantity: 250, unit: 'g', category: 'Pantry', priceEstimate: 1.2 },
            { id: 'i39', name: 'Plum Tomatoes', quantity: 400, unit: 'g', category: 'Produce', priceEstimate: 2.0 },
            { id: 'i40', name: 'Fresh Basil', quantity: 1, unit: 'bunch', category: 'Produce', priceEstimate: 1.5 },
            { id: 'i4', name: 'Olive Oil', quantity: 2, unit: 'tbsp', category: 'Pantry', priceEstimate: 0.4 },
        ]
    },
    {
        id: '20',
        name: 'Bean Cheese Quesadilla',
        type: ['lunch', 'snack'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['vegetarian'],
        nutrition: { calories: 350, protein: 14, carbs: 32, fat: 18 },
        ingredients: [
            { id: 'i16', name: 'Tortillas', quantity: 1, unit: 'pcs', category: 'Pantry', priceEstimate: 0.3 },
            { id: 'i37', name: 'Refried Beans', quantity: 100, unit: 'g', category: 'Pantry', priceEstimate: 0.8 },
            { id: 'i17', name: 'Shredded Cheese', quantity: 50, unit: 'g', category: 'Dairy', priceEstimate: 1.0 },
        ]
    },
    {
        id: '21',
        name: 'Porcupine Meatballs',
        type: ['dinner'],
        complexity: 'complex',
        isLeftoverFriendly: true,
        nutrition: { calories: 480, protein: 25, carbs: 30, fat: 28 },
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 500, unit: 'g', category: 'Meat', priceEstimate: 8.0 },
            { id: 'i41', name: 'White Rice', quantity: 100, unit: 'g', category: 'Pantry', priceEstimate: 0.5 },
            { id: 'i7', name: 'Tomato Sauce', quantity: 400, unit: 'ml', category: 'Pantry', priceEstimate: 2.0 },
        ]
    },
    {
        id: '22',
        name: 'Taco Soup',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['gluten-free'],
        nutrition: { calories: 320, protein: 22, carbs: 25, fat: 14 },
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 400, unit: 'g', category: 'Meat', priceEstimate: 6.0 },
            { id: 'i37', name: 'Black Beans', quantity: 400, unit: 'g', category: 'Pantry', priceEstimate: 1.0 },
            { id: 'i42', name: 'Corn', quantity: 200, unit: 'g', category: 'Produce', priceEstimate: 1.0 },
            { id: 'i7', name: 'Diced Tomatoes', quantity: 400, unit: 'g', category: 'Pantry', priceEstimate: 1.5 },
        ]
    },
    {
        id: '23',
        name: 'Classic Sloppy Joes',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        nutrition: { calories: 550, protein: 28, carbs: 45, fat: 25 },
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 500, unit: 'g', category: 'Meat', priceEstimate: 8.0 },
            { id: 'i43', name: 'Ketchup', quantity: 150, unit: 'ml', category: 'Pantry', priceEstimate: 1.0 },
            { id: 'i44', name: 'Hamburger Buns', quantity: 4, unit: 'pcs', category: 'Pantry', priceEstimate: 2.0 },
        ]
    },
    {
        id: '24',
        name: 'Sheet-Pan Meatloaf',
        type: ['dinner'],
        complexity: 'complex',
        isLeftoverFriendly: true,
        nutrition: { calories: 520, protein: 35, carbs: 25, fat: 30 },
        ingredients: [
            { id: 'i5', name: 'Ground Beef', quantity: 600, unit: 'g', category: 'Meat', priceEstimate: 9.0 },
            { id: 'i10', name: 'Bell Peppers', quantity: 2, unit: 'pcs', category: 'Produce', priceEstimate: 1.5 },
            { id: 'i21', name: 'Carrots', quantity: 2, unit: 'pcs', category: 'Produce', priceEstimate: 0.4 },
        ]
    },
    {
        id: '25',
        name: 'Steaks with Onion Gravy',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        nutrition: { calories: 480, protein: 40, carbs: 12, fat: 30 },
        ingredients: [
            { id: 'i5', name: 'Hamburger Steaks', quantity: 4, unit: 'pcs', category: 'Meat', priceEstimate: 10.0 },
            { id: 'i8', name: 'Onion', quantity: 2, unit: 'pcs', category: 'Produce', priceEstimate: 1.0 },
            { id: 'i45', name: 'Beef Broth', quantity: 250, unit: 'ml', category: 'Pantry', priceEstimate: 1.2 },
        ]
    },
    {
        id: '26',
        name: 'Slow Cooker Lemon Chicken',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['gluten-free'],
        nutrition: { calories: 340, protein: 40, carbs: 8, fat: 12 },
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 600, unit: 'g', category: 'Meat', priceEstimate: 8.5 },
            { id: 'i15', name: 'Lemon', quantity: 1, unit: 'pcs', category: 'Produce', priceEstimate: 0.5 },
            { id: 'i19', name: 'Garlic', quantity: 4, unit: 'cloves', category: 'Produce', priceEstimate: 0.3 },
        ]
    },
    {
        id: '27',
        name: 'Instant Pot Chicken Kale',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['keto', 'gluten-free'],
        nutrition: { calories: 310, protein: 35, carbs: 12, fat: 14 },
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 500, unit: 'g', category: 'Meat', priceEstimate: 7.0 },
            { id: 'i46', name: 'Kale', quantity: 200, unit: 'g', category: 'Produce', priceEstimate: 2.0 },
            { id: 'i7', name: 'Diced Tomatoes', quantity: 400, unit: 'g', category: 'Pantry', priceEstimate: 1.5 },
        ]
    },
    {
        id: '28',
        name: 'Chicken Apple Brussels Dinner',
        type: ['dinner'],
        complexity: 'simple',
        isLeftoverFriendly: false,
        tags: ['paleo', 'gluten-free'],
        nutrition: { calories: 450, protein: 32, carbs: 35, fat: 20 },
        ingredients: [
            { id: 'i23', name: 'Chicken Thighs', quantity: 4, unit: 'pcs', category: 'Meat', priceEstimate: 6.0 },
            { id: 'i47', name: 'Apples', quantity: 2, unit: 'pcs', category: 'Produce', priceEstimate: 1.5 },
            { id: 'i48', name: 'Brussels Sprouts', quantity: 300, unit: 'g', category: 'Produce', priceEstimate: 3.5 },
        ]
    },
    {
        id: '29',
        name: 'Skillet Chicken Quinoa',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['gluten-free'],
        nutrition: { calories: 430, protein: 35, carbs: 45, fat: 14 },
        ingredients: [
            { id: 'i1', name: 'Chicken Breast', quantity: 400, unit: 'g', category: 'Meat', priceEstimate: 5.5 },
            { id: 'i49', name: 'Quinoa', quantity: 150, unit: 'g', category: 'Pantry', priceEstimate: 2.0 },
            { id: 'i18', name: 'Fresh Salsa', quantity: 150, unit: 'g', category: 'Pantry', priceEstimate: 1.2 },
        ]
    },
    {
        id: '30',
        name: 'Chicken Zoodle Soup',
        type: ['lunch', 'dinner'],
        complexity: 'simple',
        isLeftoverFriendly: true,
        tags: ['keto', 'gluten-free'],
        nutrition: { calories: 250, protein: 28, carbs: 8, fat: 12 },
        ingredients: [
            { id: 'i1', name: 'Diced Chicken', quantity: 300, unit: 'g', category: 'Meat', priceEstimate: 4.5 },
            { id: 'i50', name: 'Zucchini Zoodles', quantity: 400, unit: 'g', category: 'Produce', priceEstimate: 3.0 },
            { id: 'i51', name: 'Chicken Stock', quantity: 1, unit: 'L', category: 'Pantry', priceEstimate: 2.5 },
        ]
    }
];

