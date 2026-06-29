import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ListRecipesQueryDto } from './dto/list-recipes-query.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './recipe.entity';

// ---------------------------------------------------------------------------
// Seed data — 100 recipes across cuisines, meal types and dietary preferences
// ---------------------------------------------------------------------------

const I = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`;

const SEED_RECIPES: CreateRecipeDto[] = [
  // ── BREAKFAST ────────────────────────────────────────────────────────────
  {
    title: 'Pasta Primavera',
    description: 'A light, colourful pasta packed with spring vegetables.',
    imageUrl: I('1473093295043-cdd812d0e601'),
    prepMinutes: 25, servings: 2,
    tags: ['vegetarian', 'quick', 'pasta', 'italian'],
    ingredients: [
      { name: 'Pasta', amount: '200g' }, { name: 'Cherry tomatoes', amount: '150g' },
      { name: 'Zucchini', amount: '1 medium' }, { name: 'Olive oil', amount: '2 tbsp' },
      { name: 'Parmesan', amount: '30g' },
    ],
    steps: [
      'Boil pasta according to package instructions.',
      'Sauté zucchini in olive oil for 3 minutes.',
      'Add cherry tomatoes and cook 2 more minutes.',
      'Toss with drained pasta and top with parmesan.',
    ],
  },
  {
    title: 'Lentil Soup',
    description: 'Hearty red lentil soup with cumin and lemon.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 35, servings: 4,
    tags: ['vegan', 'soup', 'high-protein', 'mediterranean'],
    ingredients: [
      { name: 'Red lentils', amount: '250g' }, { name: 'Onion', amount: '1 large' },
      { name: 'Garlic', amount: '3 cloves' }, { name: 'Cumin', amount: '1 tsp' },
      { name: 'Vegetable stock', amount: '1 litre' }, { name: 'Lemon juice', amount: '2 tbsp' },
    ],
    steps: [
      'Sauté onion and garlic until soft.',
      'Add cumin and toast 30 seconds.',
      'Add lentils and stock; simmer 20 minutes.',
      'Blend half the soup, stir in lemon juice, season.',
    ],
  },
  {
    title: 'Avocado Toast',
    description: 'Creamy avocado on sourdough with chilli flakes.',
    imageUrl: I('1525351484163-7529414344d8'),
    prepMinutes: 10, servings: 1,
    tags: ['vegetarian', 'quick', 'breakfast'],
    ingredients: [
      { name: 'Sourdough bread', amount: '2 slices' }, { name: 'Avocado', amount: '1 ripe' },
      { name: 'Lemon juice', amount: '1 tsp' }, { name: 'Chilli flakes', amount: 'pinch' },
      { name: 'Salt', amount: 'to taste' },
    ],
    steps: [
      'Toast bread until golden.',
      'Mash avocado with lemon juice and salt.',
      'Spread on toast, finish with chilli flakes.',
    ],
  },
  {
    title: 'Classic Pancakes',
    description: 'Fluffy American pancakes, perfect for a lazy weekend morning.',
    imageUrl: I('1493770348161-369560ae357d'),
    prepMinutes: 20, servings: 4,
    tags: ['breakfast', 'vegetarian', 'american'],
    ingredients: [
      { name: 'All-purpose flour', amount: '200g' }, { name: 'Milk', amount: '300ml' },
      { name: 'Eggs', amount: '2' }, { name: 'Baking powder', amount: '2 tsp' },
      { name: 'Sugar', amount: '2 tbsp' }, { name: 'Butter', amount: '2 tbsp, melted' },
    ],
    steps: [
      'Whisk flour, baking powder and sugar together.',
      'Mix in milk, eggs and melted butter until just combined (lumps are fine).',
      'Rest batter 5 minutes.',
      'Cook spoonfuls on a greased pan over medium heat, 2 min per side.',
    ],
  },
  {
    title: 'Shakshuka',
    description: 'Eggs poached in a spiced tomato and pepper sauce.',
    imageUrl: I('1563636619-e9143da7973b'),
    prepMinutes: 30, servings: 2,
    tags: ['vegetarian', 'breakfast', 'mediterranean', 'spicy'],
    ingredients: [
      { name: 'Canned tomatoes', amount: '400g' }, { name: 'Red pepper', amount: '1' },
      { name: 'Onion', amount: '1' }, { name: 'Garlic', amount: '2 cloves' },
      { name: 'Eggs', amount: '4' }, { name: 'Cumin', amount: '1 tsp' },
      { name: 'Paprika', amount: '1 tsp' },
    ],
    steps: [
      'Sauté onion, garlic and pepper until soft.',
      'Add spices and cook 1 minute.',
      'Pour in tomatoes; simmer 10 minutes.',
      'Make wells in the sauce and crack in eggs.',
      'Cover and cook until whites are set, yolks still runny.',
    ],
  },
  {
    title: 'Overnight Oats',
    description: 'No-cook oats soaked overnight and topped with fresh fruit.',
    imageUrl: I('1490645935967-10de6ba17061'),
    prepMinutes: 5, servings: 1,
    tags: ['breakfast', 'vegan', 'quick', 'healthy'],
    ingredients: [
      { name: 'Rolled oats', amount: '60g' }, { name: 'Oat milk', amount: '180ml' },
      { name: 'Chia seeds', amount: '1 tbsp' }, { name: 'Maple syrup', amount: '1 tsp' },
      { name: 'Mixed berries', amount: 'handful' },
    ],
    steps: [
      'Combine oats, milk and chia seeds in a jar.',
      'Stir in maple syrup.',
      'Refrigerate overnight.',
      'Top with berries before serving.',
    ],
  },
  {
    title: 'Smoothie Bowl',
    description: 'Thick açaí-style smoothie topped with granola and fruit.',
    imageUrl: I('1530554764233-e79e16c91d08'),
    prepMinutes: 10, servings: 1,
    tags: ['breakfast', 'vegan', 'quick', 'healthy'],
    ingredients: [
      { name: 'Frozen banana', amount: '2' }, { name: 'Frozen berries', amount: '100g' },
      { name: 'Almond milk', amount: '50ml' }, { name: 'Granola', amount: '30g' },
      { name: 'Sliced kiwi', amount: '1' }, { name: 'Honey', amount: '1 tsp' },
    ],
    steps: [
      'Blend frozen banana and berries with almond milk until thick.',
      'Pour into a bowl.',
      'Top with granola, kiwi and a drizzle of honey.',
    ],
  },
  {
    title: 'French Toast',
    description: 'Egg-dipped brioche toasted until golden, dusted with icing sugar.',
    imageUrl: I('1493770348161-369560ae357d'),
    prepMinutes: 15, servings: 2,
    tags: ['breakfast', 'vegetarian', 'quick', 'french'],
    ingredients: [
      { name: 'Brioche bread', amount: '4 thick slices' }, { name: 'Eggs', amount: '3' },
      { name: 'Milk', amount: '60ml' }, { name: 'Vanilla extract', amount: '1 tsp' },
      { name: 'Butter', amount: '1 tbsp' }, { name: 'Icing sugar', amount: 'for dusting' },
    ],
    steps: [
      'Whisk eggs, milk and vanilla.',
      'Soak bread slices 30 seconds per side.',
      'Fry in butter 2–3 min per side until golden.',
      'Dust with icing sugar and serve with maple syrup.',
    ],
  },
  {
    title: 'Veggie Omelette',
    description: 'Fluffy three-egg omelette stuffed with sautéed mushrooms and spinach.',
    imageUrl: I('1567620905732-2d1ec7ab7445'),
    prepMinutes: 12, servings: 1,
    tags: ['breakfast', 'vegetarian', 'quick', 'high-protein'],
    ingredients: [
      { name: 'Eggs', amount: '3' }, { name: 'Mushrooms', amount: '80g, sliced' },
      { name: 'Baby spinach', amount: 'handful' }, { name: 'Feta cheese', amount: '30g' },
      { name: 'Butter', amount: '1 tsp' }, { name: 'Salt & pepper', amount: 'to taste' },
    ],
    steps: [
      'Sauté mushrooms in butter until golden; add spinach and wilt.',
      'Whisk eggs with salt and pepper.',
      'Pour eggs into pan; cook undisturbed until edges set.',
      'Add filling to one half, fold omelette over, slide onto plate.',
    ],
  },
  {
    title: 'Chia Pudding',
    description: 'Coconut chia pudding with mango — prep the night before.',
    imageUrl: I('1490645935967-10de6ba17061'),
    prepMinutes: 5, servings: 2,
    tags: ['breakfast', 'vegan', 'dairy-free', 'healthy'],
    ingredients: [
      { name: 'Chia seeds', amount: '60g' }, { name: 'Coconut milk', amount: '400ml' },
      { name: 'Maple syrup', amount: '2 tbsp' }, { name: 'Vanilla', amount: '½ tsp' },
      { name: 'Mango', amount: '1, diced' },
    ],
    steps: [
      'Whisk chia seeds, coconut milk, maple syrup and vanilla.',
      'Refrigerate at least 4 hours (or overnight).',
      'Stir once after 30 minutes to prevent clumps.',
      'Top with mango before serving.',
    ],
  },
  {
    title: 'Breakfast Burrito',
    description: 'Scrambled eggs, black beans and salsa wrapped in a warm tortilla.',
    imageUrl: I('1519984388953-d2406bc725e1'),
    prepMinutes: 15, servings: 2,
    tags: ['breakfast', 'high-protein', 'mexican'],
    ingredients: [
      { name: 'Large flour tortillas', amount: '2' }, { name: 'Eggs', amount: '4' },
      { name: 'Black beans', amount: '120g, canned' }, { name: 'Salsa', amount: '4 tbsp' },
      { name: 'Cheddar', amount: '40g, grated' }, { name: 'Avocado', amount: '½' },
    ],
    steps: [
      'Scramble eggs in a buttered pan.',
      'Warm black beans and season with salt.',
      'Warm tortillas in a dry pan.',
      'Layer eggs, beans, cheese, avocado and salsa; roll tightly.',
    ],
  },
  {
    title: 'Banana Pancakes',
    description: 'Two-ingredient banana and egg pancakes — naturally gluten-free.',
    imageUrl: I('1493770348161-369560ae357d'),
    prepMinutes: 10, servings: 1,
    tags: ['breakfast', 'gluten-free', 'quick', 'healthy'],
    ingredients: [
      { name: 'Ripe banana', amount: '1 large' }, { name: 'Eggs', amount: '2' },
      { name: 'Coconut oil', amount: '1 tsp' }, { name: 'Cinnamon', amount: 'pinch' },
    ],
    steps: [
      'Mash banana thoroughly.',
      'Beat in eggs and cinnamon until combined.',
      'Cook small pancakes in coconut oil over medium-low heat, 2 min per side.',
    ],
  },
  // ── PASTA / ITALIAN ───────────────────────────────────────────────────────
  {
    title: 'Spaghetti Carbonara',
    description: 'Silky egg and pecorino sauce with crispy guanciale — no cream.',
    imageUrl: I('1600891964599-f61ba0e24092'),
    prepMinutes: 20, servings: 2,
    tags: ['pasta', 'italian', 'quick', 'high-protein'],
    ingredients: [
      { name: 'Spaghetti', amount: '200g' }, { name: 'Guanciale or pancetta', amount: '100g' },
      { name: 'Egg yolks', amount: '4' }, { name: 'Pecorino Romano', amount: '60g, grated' },
      { name: 'Black pepper', amount: '1 tsp, freshly ground' },
    ],
    steps: [
      'Cook spaghetti in well-salted water; reserve 150ml pasta water.',
      'Fry guanciale until crispy; remove from heat.',
      'Whisk yolks, pecorino and pepper together.',
      'Off the heat, add pasta to pan, pour egg mixture and splash of pasta water; toss vigorously.',
    ],
  },
  {
    title: 'Tagliatelle Bolognese',
    description: 'Slow-cooked beef and pork ragù with a splash of milk for richness.',
    imageUrl: I('1473093295043-cdd812d0e601'),
    prepMinutes: 90, servings: 4,
    tags: ['pasta', 'italian', 'comfort-food'],
    ingredients: [
      { name: 'Tagliatelle', amount: '320g' }, { name: 'Ground beef', amount: '250g' },
      { name: 'Ground pork', amount: '150g' }, { name: 'Onion', amount: '1' },
      { name: 'Carrots', amount: '2' }, { name: 'Celery', amount: '2 stalks' },
      { name: 'Canned tomatoes', amount: '400g' }, { name: 'Whole milk', amount: '100ml' },
    ],
    steps: [
      'Soften onion, carrot and celery 15 minutes.',
      'Add meat and brown, breaking up lumps.',
      'Pour in milk; cook until absorbed.',
      'Add tomatoes; simmer on low for 60 minutes.',
      'Toss with fresh tagliatelle.',
    ],
  },
  {
    title: 'Cacio e Pepe',
    description: 'Three-ingredient Roman classic — cheese, pepper and pasta water magic.',
    imageUrl: I('1600891964599-f61ba0e24092'),
    prepMinutes: 15, servings: 2,
    tags: ['pasta', 'italian', 'quick', 'vegetarian'],
    ingredients: [
      { name: 'Tonnarelli or spaghetti', amount: '200g' },
      { name: 'Pecorino Romano', amount: '80g, finely grated' },
      { name: 'Parmesan', amount: '40g, finely grated' },
      { name: 'Black pepper', amount: '2 tsp, coarsely ground' },
    ],
    steps: [
      'Toast pepper in a dry pan; add a ladle of pasta water and simmer.',
      'Cook pasta; reserve 200ml starchy water.',
      'Mix cheeses into a paste with cold water.',
      'Toss pasta in pepper pan; remove from heat and fold in cheese paste with pasta water.',
    ],
  },
  {
    title: 'Pesto Genovese Pasta',
    description: 'Basil pesto from scratch tossed with trofie and green beans.',
    imageUrl: I('1473093295043-cdd812d0e601'),
    prepMinutes: 20, servings: 2,
    tags: ['pasta', 'italian', 'vegetarian', 'quick'],
    ingredients: [
      { name: 'Trofie pasta', amount: '200g' }, { name: 'Fresh basil', amount: '50g' },
      { name: 'Pine nuts', amount: '30g' }, { name: 'Garlic', amount: '1 clove' },
      { name: 'Parmesan', amount: '40g' }, { name: 'Olive oil', amount: '80ml' },
      { name: 'Green beans', amount: '80g' },
    ],
    steps: [
      'Blend basil, pine nuts, garlic and parmesan; drizzle in oil.',
      'Cook trofie with green beans in the last 3 minutes.',
      'Drain, reserving pasta water, and toss with pesto.',
    ],
  },
  {
    title: 'Arrabbiata',
    description: 'Fiery tomato sauce with garlic and chilli on penne.',
    imageUrl: I('1600891964599-f61ba0e24092'),
    prepMinutes: 20, servings: 2,
    tags: ['pasta', 'italian', 'vegan', 'quick', 'spicy'],
    ingredients: [
      { name: 'Penne', amount: '200g' }, { name: 'Canned tomatoes', amount: '400g' },
      { name: 'Garlic', amount: '4 cloves' }, { name: 'Red chilli', amount: '2, dried' },
      { name: 'Olive oil', amount: '3 tbsp' }, { name: 'Parsley', amount: 'small bunch' },
    ],
    steps: [
      'Fry garlic and chilli in olive oil until fragrant.',
      'Add tomatoes; simmer 15 minutes.',
      'Cook penne and toss with sauce.',
      'Finish with fresh parsley.',
    ],
  },
  {
    title: 'Mac and Cheese',
    description: 'Baked three-cheese macaroni with a crispy breadcrumb topping.',
    imageUrl: I('1473093295043-cdd812d0e601'),
    prepMinutes: 40, servings: 4,
    tags: ['pasta', 'american', 'vegetarian', 'comfort-food'],
    ingredients: [
      { name: 'Macaroni', amount: '300g' }, { name: 'Cheddar', amount: '150g' },
      { name: 'Gruyère', amount: '80g' }, { name: 'Parmesan', amount: '50g' },
      { name: 'Whole milk', amount: '500ml' }, { name: 'Butter', amount: '3 tbsp' },
      { name: 'Flour', amount: '3 tbsp' }, { name: 'Panko breadcrumbs', amount: '60g' },
    ],
    steps: [
      'Make a roux with butter and flour; whisk in milk to form béchamel.',
      'Melt cheeses into sauce.',
      'Cook macaroni al dente and fold into sauce.',
      'Top with panko mixed with butter; bake at 200°C for 20 minutes.',
    ],
  },
  {
    title: 'Mushroom Risotto',
    description: 'Creamy risotto with porcini and chestnut mushrooms, finished with butter.',
    imageUrl: I('1512058564366-18510be2db19'),
    prepMinutes: 40, servings: 2,
    tags: ['vegetarian', 'italian', 'comfort-food'],
    ingredients: [
      { name: 'Arborio rice', amount: '200g' }, { name: 'Chestnut mushrooms', amount: '200g' },
      { name: 'Dried porcini', amount: '20g' }, { name: 'Vegetable stock', amount: '1 litre, hot' },
      { name: 'White wine', amount: '100ml' }, { name: 'Parmesan', amount: '50g' },
      { name: 'Butter', amount: '2 tbsp' }, { name: 'Shallots', amount: '2' },
    ],
    steps: [
      'Rehydrate porcini in hot water; strain and keep liquid.',
      'Sauté shallots, then add fresh and rehydrated mushrooms.',
      'Add rice; toast 2 minutes. Pour in wine.',
      'Add stock ladle by ladle, stirring, until rice is al dente.',
      'Stir in butter and parmesan off the heat.',
    ],
  },
  {
    title: 'Aglio e Olio',
    description: 'Spaghetti tossed in golden garlic, olive oil and parsley.',
    imageUrl: I('1600891964599-f61ba0e24092'),
    prepMinutes: 15, servings: 2,
    tags: ['pasta', 'italian', 'vegan', 'quick'],
    ingredients: [
      { name: 'Spaghetti', amount: '200g' }, { name: 'Garlic', amount: '6 cloves, sliced' },
      { name: 'Extra virgin olive oil', amount: '80ml' }, { name: 'Chilli flakes', amount: '½ tsp' },
      { name: 'Flat-leaf parsley', amount: 'large handful' },
    ],
    steps: [
      'Cook spaghetti in salted water; reserve 120ml pasta water.',
      'Gently fry garlic in oil until golden (not brown).',
      'Add chilli flakes and pasta water; emulsify.',
      'Toss pasta and parsley through the sauce.',
    ],
  },
  // ── SOUPS ─────────────────────────────────────────────────────────────────
  {
    title: 'Tomato Basil Soup',
    description: 'Roasted plum tomatoes blended with fresh basil and cream.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 40, servings: 4,
    tags: ['soup', 'vegetarian', 'italian', 'comfort-food'],
    ingredients: [
      { name: 'Plum tomatoes', amount: '1kg' }, { name: 'Onion', amount: '1' },
      { name: 'Garlic', amount: '4 cloves' }, { name: 'Vegetable stock', amount: '500ml' },
      { name: 'Fresh basil', amount: 'large bunch' }, { name: 'Double cream', amount: '100ml' },
    ],
    steps: [
      'Roast tomatoes, onion and garlic at 200°C for 30 minutes.',
      'Blend with stock and basil.',
      'Strain through a sieve for a smooth finish.',
      'Swirl in cream and season.',
    ],
  },
  {
    title: 'Minestrone',
    description: 'Italian vegetable soup with cannellini beans and ditalini pasta.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 45, servings: 6,
    tags: ['soup', 'vegan', 'italian', 'healthy'],
    ingredients: [
      { name: 'Cannellini beans', amount: '400g, canned' }, { name: 'Ditalini pasta', amount: '100g' },
      { name: 'Courgette', amount: '1' }, { name: 'Carrot', amount: '2' },
      { name: 'Celery', amount: '2 stalks' }, { name: 'Canned tomatoes', amount: '400g' },
      { name: 'Vegetable stock', amount: '1.5 litres' }, { name: 'Parmesan rind', amount: '1 piece' },
    ],
    steps: [
      'Soften carrot, celery and onion 10 minutes.',
      'Add courgette, tomatoes and stock with parmesan rind.',
      'Simmer 20 minutes; add beans and pasta.',
      'Cook until pasta is tender. Remove rind and season.',
    ],
  },
  {
    title: 'Butternut Squash Soup',
    description: 'Velvety roasted squash soup with ginger and a swirl of crème fraîche.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 50, servings: 4,
    tags: ['soup', 'vegetarian', 'healthy', 'comfort-food'],
    ingredients: [
      { name: 'Butternut squash', amount: '1kg' }, { name: 'Onion', amount: '1' },
      { name: 'Ginger', amount: '2cm piece' }, { name: 'Vegetable stock', amount: '750ml' },
      { name: 'Crème fraîche', amount: '4 tbsp' }, { name: 'Nutmeg', amount: 'pinch' },
    ],
    steps: [
      'Roast squash halves at 200°C for 40 minutes until caramelised.',
      'Sauté onion and ginger until soft.',
      'Scoop squash flesh and blend with onion, ginger and stock.',
      'Season and serve with a swirl of crème fraîche.',
    ],
  },
  {
    title: 'French Onion Soup',
    description: 'Deeply caramelised onion broth topped with gruyère croutons.',
    imageUrl: I('1473093226795-af9932fe5856'),
    prepMinutes: 70, servings: 4,
    tags: ['soup', 'french', 'comfort-food'],
    ingredients: [
      { name: 'Onions', amount: '1.2kg, thinly sliced' }, { name: 'Beef stock', amount: '1 litre' },
      { name: 'Dry white wine', amount: '150ml' }, { name: 'Baguette', amount: '4 slices' },
      { name: 'Gruyère', amount: '120g, grated' }, { name: 'Thyme', amount: '4 sprigs' },
    ],
    steps: [
      'Cook onions in butter for 45 minutes, stirring often, until deep golden.',
      'Add wine and reduce by half.',
      'Pour in stock and thyme; simmer 15 minutes.',
      'Ladle into oven-proof bowls, top with baguette and gruyère, grill until bubbling.',
    ],
  },
  {
    title: 'Gazpacho',
    description: 'Chilled Spanish tomato soup — no cooking required.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 15, servings: 4,
    tags: ['soup', 'vegan', 'spanish', 'quick', 'gluten-free', 'healthy'],
    ingredients: [
      { name: 'Ripe tomatoes', amount: '800g' }, { name: 'Red pepper', amount: '1' },
      { name: 'Cucumber', amount: '½' }, { name: 'Garlic', amount: '1 clove' },
      { name: 'Olive oil', amount: '60ml' }, { name: 'Sherry vinegar', amount: '2 tbsp' },
    ],
    steps: [
      'Blend all vegetables with garlic.',
      'Stream in olive oil while blending.',
      'Season with vinegar, salt and pepper.',
      'Chill for at least 2 hours before serving.',
    ],
  },
  {
    title: 'Chicken Noodle Soup',
    description: 'Classic comforting broth with shredded chicken and egg noodles.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 50, servings: 4,
    tags: ['soup', 'comfort-food', 'high-protein'],
    ingredients: [
      { name: 'Chicken thighs', amount: '4' }, { name: 'Egg noodles', amount: '150g' },
      { name: 'Carrots', amount: '3' }, { name: 'Celery', amount: '3 stalks' },
      { name: 'Onion', amount: '1' }, { name: 'Chicken stock', amount: '1.5 litres' },
      { name: 'Parsley', amount: 'small bunch' },
    ],
    steps: [
      'Simmer chicken in stock 25 minutes; remove and shred.',
      'Add carrots, celery and onion; cook 15 minutes.',
      'Add noodles and cook until tender.',
      'Return chicken to pot, season, add parsley.',
    ],
  },
  {
    title: 'Thai Coconut Soup',
    description: 'Tom Kha Gai — galangal-scented coconut broth with chicken and mushrooms.',
    imageUrl: I('1432139555190-58524dae6a55'),
    prepMinutes: 30, servings: 4,
    tags: ['soup', 'asian', 'thai', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Coconut milk', amount: '400ml' }, { name: 'Chicken stock', amount: '400ml' },
      { name: 'Chicken breast', amount: '300g, sliced' }, { name: 'Straw mushrooms', amount: '150g' },
      { name: 'Galangal', amount: '3 slices' }, { name: 'Lemongrass', amount: '2 stalks' },
      { name: 'Lime juice', amount: '2 tbsp' }, { name: 'Fish sauce', amount: '2 tbsp' },
    ],
    steps: [
      'Simmer coconut milk with galangal and lemongrass 5 minutes.',
      'Add stock, chicken and mushrooms; cook until chicken is done.',
      'Season with fish sauce, lime juice and chilli.',
      'Remove galangal and lemongrass before serving.',
    ],
  },
  {
    title: 'Tuscan White Bean Soup',
    description: 'Ribollita-inspired bean soup with cavolo nero and crusty bread.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 40, servings: 4,
    tags: ['soup', 'vegan', 'italian', 'healthy'],
    ingredients: [
      { name: 'Cannellini beans', amount: '2 × 400g cans' }, { name: 'Cavolo nero', amount: '200g' },
      { name: 'Onion', amount: '1' }, { name: 'Garlic', amount: '4 cloves' },
      { name: 'Vegetable stock', amount: '800ml' }, { name: 'Rosemary', amount: '2 sprigs' },
      { name: 'Crusty bread', amount: 'to serve' },
    ],
    steps: [
      'Sauté onion and garlic; add rosemary.',
      'Add beans (mash half) and stock.',
      'Stir in cavolo nero; simmer 15 minutes.',
      'Serve drizzled with olive oil over toasted bread.',
    ],
  },
  // ── SALADS ────────────────────────────────────────────────────────────────
  {
    title: 'Caesar Salad',
    description: 'Cos lettuce, anchovy dressing, parmesan and sourdough croutons.',
    imageUrl: I('1546069901-ba9599a7e63c'),
    prepMinutes: 20, servings: 2,
    tags: ['salad', 'quick', 'american'],
    ingredients: [
      { name: 'Cos lettuce', amount: '2 heads' }, { name: 'Anchovies', amount: '4 fillets' },
      { name: 'Garlic', amount: '1 clove' }, { name: 'Egg yolk', amount: '1' },
      { name: 'Parmesan', amount: '40g' }, { name: 'Lemon juice', amount: '1 tbsp' },
      { name: 'Olive oil', amount: '60ml' }, { name: 'Sourdough', amount: '2 slices, cubed' },
    ],
    steps: [
      'Blend anchovies, garlic, yolk, lemon and oil into dressing.',
      'Toss bread cubes in oil and bake at 200°C until golden.',
      'Dress lettuce, top with parmesan and croutons.',
    ],
  },
  {
    title: 'Greek Salad',
    description: 'Tomato, cucumber, olive and feta salad with oregano dressing.',
    imageUrl: I('1546069901-ba9599a7e63c'),
    prepMinutes: 10, servings: 2,
    tags: ['salad', 'vegetarian', 'mediterranean', 'quick', 'gluten-free'],
    ingredients: [
      { name: 'Tomatoes', amount: '3 large' }, { name: 'Cucumber', amount: '½' },
      { name: 'Red onion', amount: '½' }, { name: 'Kalamata olives', amount: '80g' },
      { name: 'Feta cheese', amount: '120g' }, { name: 'Dried oregano', amount: '1 tsp' },
      { name: 'Olive oil', amount: '3 tbsp' },
    ],
    steps: [
      'Chop tomatoes and cucumber into chunks.',
      'Slice onion thinly; add olives.',
      'Lay feta on top; drizzle with oil and sprinkle oregano.',
    ],
  },
  {
    title: 'Caprese Salad',
    description: 'Buffalo mozzarella and ripe tomatoes with fresh basil and balsamic.',
    imageUrl: I('1546069901-ba9599a7e63c'),
    prepMinutes: 8, servings: 2,
    tags: ['salad', 'vegetarian', 'italian', 'quick', 'gluten-free'],
    ingredients: [
      { name: 'Buffalo mozzarella', amount: '250g' }, { name: 'Ripe tomatoes', amount: '3 large' },
      { name: 'Fresh basil', amount: 'small bunch' }, { name: 'Extra virgin olive oil', amount: '3 tbsp' },
      { name: 'Balsamic glaze', amount: '1 tbsp' },
    ],
    steps: [
      'Slice tomatoes and mozzarella to similar thickness.',
      'Alternate slices on a platter.',
      'Tuck in basil leaves; drizzle oil and balsamic.',
    ],
  },
  {
    title: 'Quinoa Buddha Bowl',
    description: 'Roasted veggies, quinoa, avocado and tahini dressing.',
    imageUrl: I('1540420773420-3366772f4999'),
    prepMinutes: 35, servings: 2,
    tags: ['salad', 'vegan', 'gluten-free', 'healthy', 'high-protein'],
    ingredients: [
      { name: 'Quinoa', amount: '150g' }, { name: 'Sweet potato', amount: '1, cubed' },
      { name: 'Chickpeas', amount: '240g, canned' }, { name: 'Avocado', amount: '1' },
      { name: 'Baby spinach', amount: '60g' }, { name: 'Tahini', amount: '2 tbsp' },
      { name: 'Lemon juice', amount: '2 tbsp' }, { name: 'Smoked paprika', amount: '1 tsp' },
    ],
    steps: [
      'Cook quinoa; roast sweet potato and chickpeas with paprika at 200°C for 25 min.',
      'Make dressing: tahini, lemon, garlic, water.',
      'Build bowls with spinach, quinoa, veggies and avocado.',
      'Drizzle with tahini dressing.',
    ],
  },
  {
    title: 'Roasted Beet Salad',
    description: "Earthy roasted beetroot with goat's cheese and candied walnuts.",
    imageUrl: I('1512621776951-a57141f2eefd'),
    prepMinutes: 60, servings: 4,
    tags: ['salad', 'vegetarian', 'gluten-free'],
    ingredients: [
      { name: 'Beetroots', amount: '4 medium' }, { name: 'Goat cheese', amount: '100g' },
      { name: 'Walnuts', amount: '60g' }, { name: 'Honey', amount: '1 tbsp' },
      { name: 'Mixed leaves', amount: '100g' }, { name: 'Red wine vinegar', amount: '2 tbsp' },
    ],
    steps: [
      'Wrap beetroots in foil; roast at 200°C for 50 minutes.',
      'Toss walnuts with honey; bake 8 minutes until caramelised.',
      'Peel and slice beetroots.',
      'Arrange over leaves with goat cheese and walnuts; dress with vinegar and oil.',
    ],
  },
  {
    title: 'Watermelon Feta Salad',
    description: 'Juicy watermelon with feta, mint and chilli — summer on a plate.',
    imageUrl: I('1546069901-ba9599a7e63c'),
    prepMinutes: 10, servings: 4,
    tags: ['salad', 'vegetarian', 'quick', 'gluten-free'],
    ingredients: [
      { name: 'Watermelon', amount: '1kg, cubed' }, { name: 'Feta', amount: '150g, crumbled' },
      { name: 'Fresh mint', amount: 'large handful' }, { name: 'Red chilli', amount: '½, sliced' },
      { name: 'Lime juice', amount: '2 tbsp' },
    ],
    steps: [
      'Arrange watermelon on a platter.',
      'Scatter feta, mint and chilli over.',
      'Squeeze lime over everything and serve immediately.',
    ],
  },
  // ── ASIAN ─────────────────────────────────────────────────────────────────
  {
    title: 'Pad Thai',
    description: 'Stir-fried rice noodles with shrimp, tamarind and peanuts.',
    imageUrl: I('1432139555190-58524dae6a55'),
    prepMinutes: 25, servings: 2,
    tags: ['asian', 'thai', 'dairy-free', 'quick'],
    ingredients: [
      { name: 'Rice noodles', amount: '200g' }, { name: 'Shrimp', amount: '200g' },
      { name: 'Eggs', amount: '2' }, { name: 'Bean sprouts', amount: '80g' },
      { name: 'Tamarind paste', amount: '2 tbsp' }, { name: 'Fish sauce', amount: '2 tbsp' },
      { name: 'Palm sugar', amount: '1 tbsp' }, { name: 'Crushed peanuts', amount: '40g' },
    ],
    steps: [
      'Soak noodles 15 min in hot water; drain.',
      'Stir-fry shrimp in wok until pink; push to side.',
      'Scramble eggs, then add noodles, sauce and sprouts.',
      'Toss on high heat; serve with peanuts and lime.',
    ],
  },
  {
    title: 'Chicken Fried Rice',
    description: 'Wok-tossed day-old rice with chicken, egg and soy sauce.',
    imageUrl: I('1512058564366-18510be2db19'),
    prepMinutes: 20, servings: 2,
    tags: ['asian', 'quick', 'high-protein', 'dairy-free'],
    ingredients: [
      { name: 'Cooked rice (day-old)', amount: '300g' }, { name: 'Chicken breast', amount: '200g, diced' },
      { name: 'Eggs', amount: '2' }, { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Sesame oil', amount: '1 tsp' }, { name: 'Spring onions', amount: '3' },
      { name: 'Frozen peas', amount: '80g' },
    ],
    steps: [
      'Stir-fry chicken until cooked; set aside.',
      'Scramble eggs in same wok.',
      'Add rice and stir-fry on high heat.',
      'Return chicken, add peas, soy and sesame oil; toss.',
    ],
  },
  {
    title: 'Green Thai Curry',
    description: 'Fragrant coconut curry with vegetables and tofu.',
    imageUrl: I('1588166524941-3bf61a9c41db'),
    prepMinutes: 30, servings: 4,
    tags: ['asian', 'thai', 'vegan', 'dairy-free', 'spicy'],
    ingredients: [
      { name: 'Firm tofu', amount: '400g' }, { name: 'Coconut milk', amount: '400ml' },
      { name: 'Green curry paste', amount: '3 tbsp' }, { name: 'Courgette', amount: '2' },
      { name: 'Baby corn', amount: '100g' }, { name: 'Kaffir lime leaves', amount: '4' },
      { name: 'Fish sauce / soy sauce', amount: '2 tbsp' }, { name: 'Jasmine rice', amount: 'to serve' },
    ],
    steps: [
      'Fry curry paste in coconut cream 2 minutes.',
      'Add coconut milk and lime leaves.',
      'Add tofu and vegetables; simmer 12 minutes.',
      'Season with fish/soy sauce; serve over rice.',
    ],
  },
  {
    title: 'Bibimbap',
    description: 'Korean mixed rice bowl with seasoned vegetables and gochujang.',
    imageUrl: I('1512058564366-18510be2db19'),
    prepMinutes: 45, servings: 2,
    tags: ['asian', 'korean', 'healthy', 'dairy-free'],
    ingredients: [
      { name: 'Steamed rice', amount: '2 portions' }, { name: 'Spinach', amount: '100g' },
      { name: 'Carrot', amount: '1, julienned' }, { name: 'Mushrooms', amount: '100g' },
      { name: 'Courgette', amount: '1, julienned' }, { name: 'Eggs', amount: '2' },
      { name: 'Gochujang', amount: '2 tbsp' }, { name: 'Sesame oil', amount: '1 tbsp' },
    ],
    steps: [
      'Sauté each vegetable separately with garlic and sesame oil.',
      'Fry eggs sunny-side up.',
      'Arrange vegetables and egg over rice bowls.',
      'Add gochujang and mix at the table.',
    ],
  },
  {
    title: 'Pork Gyoza',
    description: 'Pan-fried Japanese dumplings with pork and cabbage filling.',
    imageUrl: I('1569050467447-ce54b3bbc37d'),
    prepMinutes: 50, servings: 4,
    tags: ['asian', 'japanese', 'snack'],
    ingredients: [
      { name: 'Gyoza wrappers', amount: '40' }, { name: 'Ground pork', amount: '300g' },
      { name: 'Napa cabbage', amount: '200g, finely chopped' },
      { name: 'Ginger', amount: '1 tbsp, grated' }, { name: 'Soy sauce', amount: '2 tbsp' },
      { name: 'Sesame oil', amount: '1 tbsp' },
    ],
    steps: [
      'Squeeze moisture from cabbage; mix with pork, ginger, soy and sesame oil.',
      'Place a teaspoon of filling in each wrapper; fold and pleat.',
      'Pan-fry flat-side down in oil 2 minutes until golden.',
      'Add water, cover and steam 4 minutes.',
    ],
  },
  {
    title: 'Teriyaki Salmon',
    description: 'Glazed salmon fillet with homemade teriyaki sauce and steamed broccoli.',
    imageUrl: I('1495195134817-aeb325a55b65'),
    prepMinutes: 20, servings: 2,
    tags: ['asian', 'japanese', 'high-protein', 'gluten-free', 'quick'],
    ingredients: [
      { name: 'Salmon fillets', amount: '2 × 150g' }, { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Mirin', amount: '3 tbsp' }, { name: 'Sugar', amount: '1 tsp' },
      { name: 'Broccoli', amount: '200g' }, { name: 'Sesame seeds', amount: '1 tbsp' },
    ],
    steps: [
      'Mix soy, mirin and sugar; simmer until slightly thickened.',
      'Pan-fry salmon 3 min skin-down; flip and brush with sauce.',
      'Steam broccoli alongside.',
      'Serve salmon over rice with remaining sauce and sesame seeds.',
    ],
  },
  {
    title: 'Vietnamese Spring Rolls',
    description: 'Fresh rice-paper rolls with shrimp, herbs and peanut dipping sauce.',
    imageUrl: I('1569050467447-ce54b3bbc37d'),
    prepMinutes: 30, servings: 4,
    tags: ['asian', 'vietnamese', 'healthy', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Rice paper wrappers', amount: '12' }, { name: 'Cooked shrimp', amount: '200g' },
      { name: 'Rice vermicelli', amount: '100g, cooked' }, { name: 'Lettuce leaves', amount: '12' },
      { name: 'Fresh mint', amount: 'bunch' }, { name: 'Peanut butter', amount: '3 tbsp' },
      { name: 'Hoisin sauce', amount: '2 tbsp' },
    ],
    steps: [
      'Soak rice paper in warm water 10 seconds until pliable.',
      'Layer lettuce, noodles, shrimp and herbs; roll tightly.',
      'Mix peanut butter with hoisin and a splash of water for dipping sauce.',
    ],
  },
  {
    title: 'Sushi Bowl',
    description: 'Deconstructed sushi — seasoned rice with salmon, avocado and pickled ginger.',
    imageUrl: I('1556909114-f6e7ad7d3136'),
    prepMinutes: 20, servings: 2,
    tags: ['asian', 'japanese', 'healthy', 'dairy-free', 'quick'],
    ingredients: [
      { name: 'Sushi rice', amount: '200g, cooked' }, { name: 'Sushi-grade salmon', amount: '150g' },
      { name: 'Avocado', amount: '1' }, { name: 'Cucumber', amount: '½' },
      { name: 'Pickled ginger', amount: '2 tbsp' }, { name: 'Soy sauce', amount: 'to serve' },
      { name: 'Sesame seeds', amount: '1 tbsp' }, { name: 'Rice vinegar', amount: '2 tbsp' },
    ],
    steps: [
      'Season hot rice with rice vinegar and a pinch of sugar.',
      'Slice salmon, avocado and cucumber.',
      'Arrange over rice; add pickled ginger and sesame.',
      'Serve with soy sauce and wasabi.',
    ],
  },
  {
    title: 'Miso Soup',
    description: 'Dashi-based broth with white miso, tofu and wakame.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 10, servings: 4,
    tags: ['asian', 'japanese', 'vegan', 'quick', 'gluten-free'],
    ingredients: [
      { name: 'Dashi stock', amount: '1 litre' }, { name: 'White miso paste', amount: '4 tbsp' },
      { name: 'Silken tofu', amount: '200g, cubed' }, { name: 'Dried wakame', amount: '2 tbsp' },
      { name: 'Spring onions', amount: '2, sliced' },
    ],
    steps: [
      'Rehydrate wakame in cold water 5 minutes.',
      'Heat dashi to just below boiling.',
      'Whisk in miso paste; do not boil.',
      'Add tofu, wakame and spring onions; serve immediately.',
    ],
  },
  // ── INDIAN / MIDDLE-EASTERN ───────────────────────────────────────────────
  {
    title: 'Butter Chicken',
    description: 'Tender chicken in a rich, creamy tomato-spiced sauce.',
    imageUrl: I('1588166524941-3bf61a9c41db'),
    prepMinutes: 45, servings: 4,
    tags: ['indian', 'high-protein', 'comfort-food', 'spicy'],
    ingredients: [
      { name: 'Chicken thighs', amount: '700g' }, { name: 'Yoghurt', amount: '150ml' },
      { name: 'Butter', amount: '3 tbsp' }, { name: 'Garam masala', amount: '2 tsp' },
      { name: 'Canned tomatoes', amount: '400g' }, { name: 'Double cream', amount: '100ml' },
      { name: 'Garlic', amount: '4 cloves' }, { name: 'Ginger', amount: '2cm piece' },
    ],
    steps: [
      'Marinate chicken in yoghurt and spices for 30 minutes; grill or pan-fry.',
      'Blend tomatoes with garlic and ginger; cook in butter 10 min.',
      'Add cream and grilled chicken; simmer 10 minutes.',
      'Finish with garam masala and serve with naan.',
    ],
  },
  {
    title: 'Dal Tadka',
    description: 'Yellow lentils tempered with cumin, garlic and tomato.',
    imageUrl: I('1588166524941-3bf61a9c41db'),
    prepMinutes: 40, servings: 4,
    tags: ['indian', 'vegan', 'high-protein', 'gluten-free'],
    ingredients: [
      { name: 'Yellow split peas', amount: '250g' }, { name: 'Onion', amount: '1' },
      { name: 'Tomatoes', amount: '2' }, { name: 'Garlic', amount: '4 cloves' },
      { name: 'Cumin seeds', amount: '1 tsp' }, { name: 'Turmeric', amount: '½ tsp' },
      { name: 'Ghee', amount: '2 tbsp' }, { name: 'Dried chilli', amount: '2' },
    ],
    steps: [
      'Boil lentils until soft; season with turmeric and salt.',
      'Fry cumin seeds in ghee until they pop.',
      'Add garlic, chilli and tomatoes; cook 5 minutes.',
      'Pour tadka over lentils and stir.',
    ],
  },
  {
    title: 'Chana Masala',
    description: 'Spiced chickpea curry with tomato and garam masala.',
    imageUrl: I('1588166524941-3bf61a9c41db'),
    prepMinutes: 35, servings: 4,
    tags: ['indian', 'vegan', 'high-protein', 'gluten-free', 'spicy'],
    ingredients: [
      { name: 'Chickpeas', amount: '2 × 400g cans' }, { name: 'Onions', amount: '2' },
      { name: 'Canned tomatoes', amount: '400g' }, { name: 'Garlic', amount: '4 cloves' },
      { name: 'Ginger', amount: '2cm piece' }, { name: 'Garam masala', amount: '2 tsp' },
      { name: 'Cumin', amount: '1 tsp' }, { name: 'Coriander', amount: 'to garnish' },
    ],
    steps: [
      'Fry onions until golden brown, about 15 minutes.',
      'Add garlic, ginger and spices; cook 2 minutes.',
      'Add tomatoes; simmer 10 minutes.',
      'Fold in chickpeas; cook 10 more minutes. Garnish with coriander.',
    ],
  },
  {
    title: 'Palak Paneer',
    description: 'Creamy spinach gravy with cubes of pan-fried paneer.',
    imageUrl: I('1588166524941-3bf61a9c41db'),
    prepMinutes: 35, servings: 4,
    tags: ['indian', 'vegetarian', 'gluten-free', 'high-protein'],
    ingredients: [
      { name: 'Paneer', amount: '250g, cubed' }, { name: 'Baby spinach', amount: '500g' },
      { name: 'Onion', amount: '1' }, { name: 'Garlic', amount: '3 cloves' },
      { name: 'Ginger', amount: '1cm' }, { name: 'Garam masala', amount: '1 tsp' },
      { name: 'Double cream', amount: '3 tbsp' },
    ],
    steps: [
      'Blanch spinach 1 minute; blend until smooth.',
      'Pan-fry paneer until golden; set aside.',
      'Sauté onion, garlic and ginger; add garam masala.',
      'Add spinach purée and cream; fold in paneer.',
    ],
  },
  {
    title: 'Falafel Wrap',
    description: 'Crispy baked falafel in flatbread with tzatziki and pickles.',
    imageUrl: I('1540420773420-3366772f4999'),
    prepMinutes: 40, servings: 4,
    tags: ['mediterranean', 'vegan', 'high-protein'],
    ingredients: [
      { name: 'Dried chickpeas', amount: '250g, soaked' }, { name: 'Onion', amount: '½' },
      { name: 'Garlic', amount: '2 cloves' }, { name: 'Cumin', amount: '2 tsp' },
      { name: 'Fresh coriander', amount: 'large bunch' }, { name: 'Flatbreads', amount: '4' },
      { name: 'Tzatziki', amount: '4 tbsp' }, { name: 'Pickled cucumber', amount: 'to serve' },
    ],
    steps: [
      'Blend soaked chickpeas with onion, garlic, cumin and coriander.',
      'Form into balls; bake at 200°C for 20 minutes.',
      'Serve in flatbreads with tzatziki and pickles.',
    ],
  },
  {
    title: 'Tabbouleh',
    description: 'Lebanese herb salad with bulgur, parsley, mint and lemon.',
    imageUrl: I('1512621776951-a57141f2eefd'),
    prepMinutes: 20, servings: 4,
    tags: ['mediterranean', 'vegan', 'salad', 'healthy', 'quick'],
    ingredients: [
      { name: 'Bulgur wheat', amount: '80g' }, { name: 'Flat-leaf parsley', amount: '3 large bunches' },
      { name: 'Fresh mint', amount: '1 bunch' }, { name: 'Tomatoes', amount: '3' },
      { name: 'Spring onions', amount: '4' }, { name: 'Lemon juice', amount: '60ml' },
      { name: 'Olive oil', amount: '60ml' },
    ],
    steps: [
      'Soak bulgur in cold water 20 minutes; drain and squeeze dry.',
      'Chop parsley and mint very finely.',
      'Dice tomatoes; slice spring onions.',
      'Combine all; dress with lemon juice and olive oil.',
    ],
  },
  {
    title: 'Hummus',
    description: 'Silky homemade hummus with tahini, lemon and paprika.',
    imageUrl: I('1540420773420-3366772f4999'),
    prepMinutes: 10, servings: 8,
    tags: ['mediterranean', 'vegan', 'snack', 'gluten-free', 'quick'],
    ingredients: [
      { name: 'Chickpeas', amount: '400g, canned' }, { name: 'Tahini', amount: '3 tbsp' },
      { name: 'Garlic', amount: '1 clove' }, { name: 'Lemon juice', amount: '3 tbsp' },
      { name: 'Ice water', amount: '3–5 tbsp' }, { name: 'Smoked paprika', amount: 'to garnish' },
    ],
    steps: [
      'Blend chickpeas, tahini, garlic and lemon until smooth.',
      'Add ice water a tablespoon at a time until fluffy.',
      'Season and serve with olive oil and smoked paprika.',
    ],
  },
  // ── MEXICAN / AMERICAN ───────────────────────────────────────────────────
  {
    title: 'Tacos al Pastor',
    description: 'Marinated pork with pineapple salsa in corn tortillas.',
    imageUrl: I('1519984388953-d2406bc725e1'),
    prepMinutes: 35, servings: 4,
    tags: ['mexican', 'spicy', 'dairy-free'],
    ingredients: [
      { name: 'Pork shoulder', amount: '500g, thinly sliced' }, { name: 'Chipotle paste', amount: '2 tbsp' },
      { name: 'Pineapple', amount: '200g, diced' }, { name: 'Corn tortillas', amount: '8' },
      { name: 'White onion', amount: '½, minced' }, { name: 'Coriander', amount: 'to serve' },
      { name: 'Lime', amount: '2' },
    ],
    steps: [
      'Marinate pork in chipotle paste, achiote and lime juice for 20 min.',
      'Cook pork in a dry pan or on a grill until charred.',
      'Warm tortillas; fill with pork, pineapple, onion and coriander.',
      'Squeeze lime over and serve.',
    ],
  },
  {
    title: 'Guacamole',
    description: 'Chunky avocado dip with lime, jalapeño and red onion.',
    imageUrl: I('1546069901-ba9599a7e63c'),
    prepMinutes: 10, servings: 4,
    tags: ['mexican', 'vegan', 'snack', 'gluten-free', 'quick'],
    ingredients: [
      { name: 'Ripe avocados', amount: '3' }, { name: 'Lime juice', amount: '2 tbsp' },
      { name: 'Red onion', amount: '¼, minced' }, { name: 'Jalapeño', amount: '1, seeded' },
      { name: 'Fresh coriander', amount: 'handful' }, { name: 'Salt', amount: 'to taste' },
    ],
    steps: [
      'Mash avocados to a rough texture.',
      'Stir in lime juice, salt, onion and jalapeño.',
      'Fold in coriander and taste for seasoning.',
    ],
  },
  {
    title: 'Beef Chili',
    description: 'Slow-simmered beef and kidney bean chili with chipotle.',
    imageUrl: I('1568901346375-23c9450c58cd'),
    prepMinutes: 70, servings: 6,
    tags: ['american', 'mexican', 'high-protein', 'comfort-food', 'spicy'],
    ingredients: [
      { name: 'Ground beef', amount: '600g' }, { name: 'Kidney beans', amount: '2 × 400g cans' },
      { name: 'Canned tomatoes', amount: '400g' }, { name: 'Onion', amount: '1' },
      { name: 'Chipotle paste', amount: '2 tbsp' }, { name: 'Cumin', amount: '2 tsp' },
      { name: 'Chili powder', amount: '2 tsp' },
    ],
    steps: [
      'Brown beef in batches; set aside.',
      'Sauté onion; add spices and chipotle.',
      'Return beef, add tomatoes and beans; simmer 45 minutes.',
      'Serve with sour cream, cheddar and corn chips.',
    ],
  },
  {
    title: 'Chicken Quesadilla',
    description: 'Crispy flour tortilla filled with chicken, pepper jack and jalapeños.',
    imageUrl: I('1519984388953-d2406bc725e1'),
    prepMinutes: 20, servings: 2,
    tags: ['mexican', 'quick', 'high-protein'],
    ingredients: [
      { name: 'Flour tortillas', amount: '4 large' }, { name: 'Cooked chicken breast', amount: '200g, shredded' },
      { name: 'Pepper jack cheese', amount: '100g, grated' }, { name: 'Jalapeños', amount: '2, sliced' },
      { name: 'Sour cream', amount: 'to serve' },
    ],
    steps: [
      'Heat a dry pan over medium-high.',
      'Layer chicken, cheese and jalapeños on half a tortilla; fold.',
      'Cook 2 min per side until golden and cheese has melted.',
      'Slice into wedges and serve with sour cream.',
    ],
  },
  {
    title: 'Burrito Bowl',
    description: 'Cilantro-lime rice, black beans, roasted corn and chipotle crema.',
    imageUrl: I('1512058564366-18510be2db19'),
    prepMinutes: 30, servings: 2,
    tags: ['mexican', 'vegetarian', 'healthy'],
    ingredients: [
      { name: 'Long-grain rice', amount: '150g' }, { name: 'Black beans', amount: '240g, canned' },
      { name: 'Corn', amount: '150g' }, { name: 'Avocado', amount: '1' },
      { name: 'Lime juice', amount: '2 tbsp' }, { name: 'Chipotle paste', amount: '1 tsp' },
      { name: 'Sour cream', amount: '3 tbsp' }, { name: 'Coriander', amount: 'handful' },
    ],
    steps: [
      'Cook rice; stir in lime juice and coriander.',
      'Roast corn in a dry pan until charred.',
      'Warm beans with cumin and salt.',
      'Mix chipotle into sour cream.',
      'Assemble bowls with rice, beans, corn, avocado and chipotle crema.',
    ],
  },
  {
    title: 'Grilled Cheese Sandwich',
    description: 'Buttery, crispy sourdough oozing with three cheeses.',
    imageUrl: I('1504674900247-0877df9cc836'),
    prepMinutes: 10, servings: 1,
    tags: ['american', 'vegetarian', 'quick', 'comfort-food'],
    ingredients: [
      { name: 'Sourdough bread', amount: '2 thick slices' }, { name: 'Cheddar', amount: '40g, sliced' },
      { name: 'Gruyère', amount: '30g, sliced' }, { name: 'Fontina', amount: '30g, sliced' },
      { name: 'Butter', amount: '1½ tbsp' },
    ],
    steps: [
      'Butter outer sides of both bread slices.',
      'Layer cheeses between slices.',
      'Cook in a pan over medium-low heat, 3–4 min per side, pressing gently.',
    ],
  },
  // ── MAINS / PROTEINS ──────────────────────────────────────────────────────
  {
    title: 'Roast Chicken',
    description: 'Herb-butter roast chicken with crispy skin and pan juices.',
    imageUrl: I('1495195134817-aeb325a55b65'),
    prepMinutes: 80, servings: 4,
    tags: ['american', 'high-protein', 'gluten-free', 'comfort-food'],
    ingredients: [
      { name: 'Whole chicken', amount: '1.5kg' }, { name: 'Butter', amount: '60g, softened' },
      { name: 'Garlic', amount: '1 head' }, { name: 'Lemon', amount: '1' },
      { name: 'Thyme & rosemary', amount: 'small bunch' }, { name: 'Olive oil', amount: '2 tbsp' },
    ],
    steps: [
      'Mix butter with herbs and garlic; push under the skin.',
      'Stuff cavity with lemon and herb stems.',
      'Roast at 200°C for 20 min/500g plus 20 min resting.',
      'Deglaze pan with white wine for pan sauce.',
    ],
  },
  {
    title: 'Lemon Butter Salmon',
    description: 'Pan-seared salmon with a bright lemon-caper butter sauce.',
    imageUrl: I('1495195134817-aeb325a55b65'),
    prepMinutes: 20, servings: 2,
    tags: ['high-protein', 'gluten-free', 'quick', 'healthy'],
    ingredients: [
      { name: 'Salmon fillets', amount: '2 × 180g' }, { name: 'Butter', amount: '3 tbsp' },
      { name: 'Lemon', amount: '1' }, { name: 'Capers', amount: '2 tbsp' },
      { name: 'Garlic', amount: '2 cloves' }, { name: 'Parsley', amount: 'small bunch' },
    ],
    steps: [
      'Season salmon; sear skin-side down 4 min, flip 2 min.',
      'Remove fish; add butter and garlic to pan.',
      'Add capers and lemon juice; pour over salmon.',
      'Garnish with parsley.',
    ],
  },
  {
    title: 'Beef Stew',
    description: 'Fall-apart beef in a rich red wine and vegetable braise.',
    imageUrl: I('1568901346375-23c9450c58cd'),
    prepMinutes: 120, servings: 6,
    tags: ['comfort-food', 'high-protein', 'gluten-free'],
    ingredients: [
      { name: 'Beef chuck', amount: '1kg, cubed' }, { name: 'Red wine', amount: '250ml' },
      { name: 'Beef stock', amount: '500ml' }, { name: 'Carrots', amount: '3' },
      { name: 'Potatoes', amount: '4 medium' }, { name: 'Onions', amount: '2' },
      { name: 'Tomato paste', amount: '2 tbsp' }, { name: 'Thyme', amount: '4 sprigs' },
    ],
    steps: [
      'Brown beef in batches; set aside.',
      'Sauté onions; add tomato paste and wine; reduce by half.',
      'Return beef with stock, carrots, potatoes and thyme.',
      'Braise at 160°C for 1.5 hours until tender.',
    ],
  },
  {
    title: 'Turkey Meatballs',
    description: 'Lean turkey meatballs in marinara, great with spaghetti or on their own.',
    imageUrl: I('1495195134817-aeb325a55b65'),
    prepMinutes: 40, servings: 4,
    tags: ['high-protein', 'italian', 'healthy'],
    ingredients: [
      { name: 'Ground turkey', amount: '500g' }, { name: 'Breadcrumbs', amount: '60g' },
      { name: 'Parmesan', amount: '40g, grated' }, { name: 'Egg', amount: '1' },
      { name: 'Garlic', amount: '2 cloves' }, { name: 'Marinara sauce', amount: '400ml' },
      { name: 'Fresh basil', amount: 'to serve' },
    ],
    steps: [
      'Mix turkey, breadcrumbs, parmesan, egg and garlic.',
      'Roll into 3cm balls; bake at 200°C for 18 minutes.',
      'Simmer in marinara sauce 10 minutes.',
      'Serve with spaghetti and fresh basil.',
    ],
  },
  {
    title: 'Tofu Stir-Fry',
    description: 'Crispy tofu with broccoli and bell pepper in ginger-soy sauce.',
    imageUrl: I('1512621776951-a57141f2eefd'),
    prepMinutes: 25, servings: 2,
    tags: ['asian', 'vegan', 'high-protein', 'quick', 'dairy-free'],
    ingredients: [
      { name: 'Extra-firm tofu', amount: '400g' }, { name: 'Broccoli', amount: '200g' },
      { name: 'Red pepper', amount: '1' }, { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Ginger', amount: '1 tbsp, grated' }, { name: 'Sesame oil', amount: '1 tsp' },
      { name: 'Cornstarch', amount: '2 tbsp' },
    ],
    steps: [
      'Press and cube tofu; toss in cornstarch.',
      'Pan-fry tofu until golden on all sides; set aside.',
      'Stir-fry broccoli and pepper; add ginger and soy.',
      'Return tofu; toss and finish with sesame oil.',
    ],
  },
  {
    title: 'Shrimp Scampi',
    description: 'Garlic butter shrimp over linguine with white wine and lemon.',
    imageUrl: I('1495195134817-aeb325a55b65'),
    prepMinutes: 20, servings: 2,
    tags: ['italian', 'pasta', 'quick', 'high-protein'],
    ingredients: [
      { name: 'Shrimp', amount: '300g, peeled' }, { name: 'Linguine', amount: '180g' },
      { name: 'Butter', amount: '3 tbsp' }, { name: 'Garlic', amount: '5 cloves' },
      { name: 'White wine', amount: '80ml' }, { name: 'Lemon juice', amount: '2 tbsp' },
      { name: 'Parsley', amount: 'handful' },
    ],
    steps: [
      'Cook linguine al dente.',
      'Sauté garlic in butter; add shrimp and cook 2 min.',
      'Add wine and lemon juice; reduce 2 minutes.',
      'Toss with pasta and parsley; serve immediately.',
    ],
  },
  {
    title: 'Stuffed Bell Peppers',
    description: 'Peppers filled with spiced beef, rice and tomato, topped with cheese.',
    imageUrl: I('1512621776951-a57141f2eefd'),
    prepMinutes: 55, servings: 4,
    tags: ['healthy', 'high-protein', 'gluten-free', 'comfort-food'],
    ingredients: [
      { name: 'Bell peppers', amount: '4 large' }, { name: 'Ground beef', amount: '400g' },
      { name: 'Cooked rice', amount: '150g' }, { name: 'Canned tomatoes', amount: '200g' },
      { name: 'Onion', amount: '1' }, { name: 'Cheddar', amount: '80g, grated' },
      { name: 'Italian seasoning', amount: '2 tsp' },
    ],
    steps: [
      'Halve peppers and remove seeds; brush with oil.',
      'Brown beef with onion and seasoning; stir in tomatoes and rice.',
      'Fill peppers with mixture; top with cheese.',
      'Bake at 190°C for 30 minutes.',
    ],
  },
  {
    title: 'BBQ Pulled Pork',
    description: 'Slow-roasted pork shoulder in smoky BBQ sauce for sandwiches.',
    imageUrl: I('1568901346375-23c9450c58cd'),
    prepMinutes: 300, servings: 8,
    tags: ['american', 'comfort-food', 'high-protein'],
    ingredients: [
      { name: 'Pork shoulder', amount: '2kg' }, { name: 'BBQ sauce', amount: '300ml' },
      { name: 'Brown sugar', amount: '3 tbsp' }, { name: 'Smoked paprika', amount: '2 tbsp' },
      { name: 'Garlic powder', amount: '1 tsp' }, { name: 'Brioche buns', amount: '8' },
      { name: 'Coleslaw', amount: 'to serve' },
    ],
    steps: [
      'Rub pork with sugar, paprika and garlic powder.',
      'Roast at 140°C for 4 hours until falling apart.',
      'Shred with two forks; mix with BBQ sauce.',
      'Pile high on brioche buns with coleslaw.',
    ],
  },
  // ── SNACKS / APPETISERS ───────────────────────────────────────────────────
  {
    title: 'Bruschetta al Pomodoro',
    description: 'Grilled bread rubbed with garlic and topped with tomato concasse.',
    imageUrl: I('1555507036-ab1f4038808a'),
    prepMinutes: 15, servings: 4,
    tags: ['italian', 'snack', 'vegetarian', 'quick'],
    ingredients: [
      { name: 'Ciabatta', amount: '8 slices' }, { name: 'Ripe tomatoes', amount: '4' },
      { name: 'Garlic', amount: '2 cloves' }, { name: 'Basil', amount: 'small bunch' },
      { name: 'Olive oil', amount: '3 tbsp' },
    ],
    steps: [
      'Grill or toast bread until golden.',
      'Rub immediately with cut garlic clove.',
      'Dice tomatoes; season with salt, olive oil and basil.',
      'Spoon onto toast and serve.',
    ],
  },
  {
    title: 'Spinach Artichoke Dip',
    description: 'Warm, cheesy dip with spinach and artichoke hearts.',
    imageUrl: I('1504674900247-0877df9cc836'),
    prepMinutes: 25, servings: 8,
    tags: ['snack', 'vegetarian', 'american'],
    ingredients: [
      { name: 'Frozen spinach', amount: '300g, thawed and squeezed' },
      { name: 'Artichoke hearts', amount: '400g, chopped' },
      { name: 'Cream cheese', amount: '200g' }, { name: 'Sour cream', amount: '100g' },
      { name: 'Parmesan', amount: '80g' }, { name: 'Garlic', amount: '2 cloves' },
    ],
    steps: [
      'Mix all ingredients together.',
      'Transfer to a baking dish.',
      'Bake at 190°C for 20 minutes until golden and bubbling.',
      'Serve with tortilla chips or crusty bread.',
    ],
  },
  {
    title: 'Deviled Eggs',
    description: 'Classic deviled eggs with a smoky paprika finish.',
    imageUrl: I('1567620905732-2d1ec7ab7445'),
    prepMinutes: 20, servings: 6,
    tags: ['snack', 'gluten-free', 'quick', 'american'],
    ingredients: [
      { name: 'Eggs', amount: '6 large' }, { name: 'Mayonnaise', amount: '3 tbsp' },
      { name: 'Dijon mustard', amount: '1 tsp' }, { name: 'White wine vinegar', amount: '1 tsp' },
      { name: 'Smoked paprika', amount: 'to garnish' },
    ],
    steps: [
      'Hard-boil eggs 10 minutes; cool and peel.',
      'Halve eggs; scoop yolks into a bowl.',
      'Mash yolks with mayo, mustard and vinegar.',
      'Pipe or spoon filling back; dust with paprika.',
    ],
  },
  {
    title: 'Buffalo Cauliflower',
    description: 'Roasted cauliflower florets tossed in hot sauce, served with blue cheese dip.',
    imageUrl: I('1512621776951-a57141f2eefd'),
    prepMinutes: 30, servings: 4,
    tags: ['snack', 'vegetarian', 'american', 'spicy'],
    ingredients: [
      { name: 'Cauliflower', amount: '1 large head' }, { name: 'Hot sauce', amount: '80ml' },
      { name: 'Butter', amount: '3 tbsp, melted' }, { name: 'Garlic powder', amount: '1 tsp' },
      { name: 'Blue cheese dressing', amount: 'to serve' }, { name: 'Celery sticks', amount: 'to serve' },
    ],
    steps: [
      'Cut cauliflower into florets; toss with garlic powder and oil.',
      'Roast at 220°C for 20 minutes until charred at edges.',
      'Toss with hot sauce and melted butter.',
      'Serve with blue cheese dressing and celery.',
    ],
  },
  // ── BAKING ────────────────────────────────────────────────────────────────
  {
    title: 'Banana Bread',
    description: 'Moist, tender banana bread with walnuts and a hint of cinnamon.',
    imageUrl: I('1555507036-ab1f4038808a'),
    prepMinutes: 65, servings: 10,
    tags: ['baking', 'vegetarian', 'snack', 'american'],
    ingredients: [
      { name: 'Ripe bananas', amount: '3 large' }, { name: 'All-purpose flour', amount: '200g' },
      { name: 'Sugar', amount: '100g' }, { name: 'Butter', amount: '80g, melted' },
      { name: 'Eggs', amount: '2' }, { name: 'Walnuts', amount: '80g, chopped' },
      { name: 'Cinnamon', amount: '1 tsp' }, { name: 'Baking soda', amount: '1 tsp' },
    ],
    steps: [
      'Mash bananas with melted butter.',
      'Stir in sugar, eggs and vanilla.',
      'Fold in flour, baking soda and cinnamon; add walnuts.',
      'Bake in a loaf tin at 180°C for 50–55 minutes.',
    ],
  },
  {
    title: 'Sourdough Focaccia',
    description: 'Dimple-topped focaccia with rosemary and flaky sea salt.',
    imageUrl: I('1555507036-ab1f4038808a'),
    prepMinutes: 240, servings: 12,
    tags: ['baking', 'vegan', 'italian'],
    ingredients: [
      { name: 'Bread flour', amount: '500g' }, { name: 'Water', amount: '380ml' },
      { name: 'Active sourdough starter', amount: '100g' }, { name: 'Olive oil', amount: '60ml' },
      { name: 'Salt', amount: '10g' }, { name: 'Fresh rosemary', amount: '4 sprigs' },
      { name: 'Flaky sea salt', amount: '1 tbsp' },
    ],
    steps: [
      'Mix starter, flour, water and salt; bulk ferment 4 hours with folds every 30 min.',
      'Oil a large tin; pour in dough and stretch to edges.',
      'Proof 1 hour; dimple deeply, drizzle with olive oil.',
      'Press in rosemary; bake at 230°C for 22 minutes.',
    ],
  },
  {
    title: 'Blueberry Muffins',
    description: 'Bakery-style muffins with a crunchy sugar top and juicy blueberries.',
    imageUrl: I('1603133872878-684f208fb84b'),
    prepMinutes: 35, servings: 12,
    tags: ['baking', 'vegetarian', 'breakfast', 'snack'],
    ingredients: [
      { name: 'All-purpose flour', amount: '280g' }, { name: 'Sugar', amount: '150g' },
      { name: 'Baking powder', amount: '2 tsp' }, { name: 'Butter', amount: '80g, melted' },
      { name: 'Eggs', amount: '2' }, { name: 'Buttermilk', amount: '200ml' },
      { name: 'Blueberries', amount: '200g' }, { name: 'Demerara sugar', amount: '3 tbsp' },
    ],
    steps: [
      'Whisk dry ingredients; mix wet ingredients separately.',
      'Fold wet into dry until just combined; fold in blueberries.',
      'Divide into muffin tin; sprinkle demerara sugar on top.',
      'Bake at 200°C for 20–22 minutes.',
    ],
  },
  // ── DESSERTS ──────────────────────────────────────────────────────────────
  {
    title: 'Chocolate Lava Cake',
    description: 'Warm chocolate fondant with a molten centre.',
    imageUrl: I('1414235077428-338989a2e8c0'),
    prepMinutes: 25, servings: 4,
    tags: ['dessert', 'french', 'vegetarian', 'quick'],
    ingredients: [
      { name: 'Dark chocolate (70%)', amount: '150g' }, { name: 'Butter', amount: '150g' },
      { name: 'Eggs', amount: '4' }, { name: 'Egg yolks', amount: '4' },
      { name: 'Sugar', amount: '120g' }, { name: 'Plain flour', amount: '4 tbsp' },
      { name: 'Cocoa powder', amount: '2 tbsp' },
    ],
    steps: [
      'Melt chocolate and butter together; cool slightly.',
      'Whisk eggs, yolks and sugar until thick; fold in chocolate.',
      'Fold in flour.',
      'Bake in buttered ramekins at 200°C for 10–11 minutes until edges set but centre jiggles.',
    ],
  },
  {
    title: 'Apple Crumble',
    description: 'Spiced Bramley apple filling under a buttery oat crumble.',
    imageUrl: I('1414235077428-338989a2e8c0'),
    prepMinutes: 50, servings: 6,
    tags: ['dessert', 'vegetarian', 'british', 'comfort-food', 'baking'],
    ingredients: [
      { name: 'Bramley apples', amount: '1kg, peeled and sliced' }, { name: 'Sugar', amount: '4 tbsp' },
      { name: 'Cinnamon', amount: '2 tsp' }, { name: 'Rolled oats', amount: '80g' },
      { name: 'Plain flour', amount: '100g' }, { name: 'Butter', amount: '80g, cold cubed' },
      { name: 'Light brown sugar', amount: '60g' },
    ],
    steps: [
      'Toss apples with sugar and cinnamon in a baking dish.',
      'Rub butter into flour and oats; stir in brown sugar.',
      'Spread crumble evenly over apples.',
      'Bake at 190°C for 35 minutes until golden and bubbling.',
    ],
  },
  {
    title: 'Tiramisu',
    description: 'Classic Italian coffee dessert with mascarpone and Savoiardi biscuits.',
    imageUrl: I('1414235077428-338989a2e8c0'),
    prepMinutes: 30, servings: 8,
    tags: ['dessert', 'italian', 'no-bake'],
    ingredients: [
      { name: 'Savoiardi biscuits', amount: '200g' }, { name: 'Mascarpone', amount: '500g' },
      { name: 'Egg yolks', amount: '4' }, { name: 'Sugar', amount: '80g' },
      { name: 'Strong espresso', amount: '250ml, cooled' }, { name: 'Coffee liqueur', amount: '2 tbsp' },
      { name: 'Cocoa powder', amount: 'to dust' },
    ],
    steps: [
      'Whisk yolks and sugar until pale; fold in mascarpone.',
      'Dip biscuits briefly in espresso+liqueur; line a dish.',
      'Spread half the cream; repeat biscuit and cream layers.',
      'Refrigerate 4 hours; dust with cocoa before serving.',
    ],
  },
  {
    title: 'Chocolate Chip Cookies',
    description: 'Brown-butter chocolate chunk cookies — crispy edge, chewy centre.',
    imageUrl: I('1603133872878-684f208fb84b'),
    prepMinutes: 30, servings: 24,
    tags: ['dessert', 'baking', 'vegetarian', 'american'],
    ingredients: [
      { name: 'Butter', amount: '225g, browned' }, { name: 'Brown sugar', amount: '200g' },
      { name: 'Caster sugar', amount: '100g' }, { name: 'Eggs', amount: '2' },
      { name: 'All-purpose flour', amount: '280g' }, { name: 'Dark chocolate chunks', amount: '200g' },
      { name: 'Vanilla extract', amount: '2 tsp' }, { name: 'Baking soda', amount: '1 tsp' },
    ],
    steps: [
      'Brown butter until nutty; cool 10 minutes.',
      'Beat with sugars; add eggs and vanilla.',
      'Fold in flour, baking soda and chocolate chunks.',
      'Scoop onto trays; bake at 180°C for 11–12 minutes.',
    ],
  },
  {
    title: 'New York Cheesecake',
    description: 'Dense, creamy baked cheesecake on a graham cracker crust.',
    imageUrl: I('1414235077428-338989a2e8c0'),
    prepMinutes: 90, servings: 12,
    tags: ['dessert', 'baking', 'american'],
    ingredients: [
      { name: 'Cream cheese', amount: '900g, room temperature' }, { name: 'Sugar', amount: '200g' },
      { name: 'Eggs', amount: '4' }, { name: 'Sour cream', amount: '200g' },
      { name: 'Graham crackers', amount: '200g, crushed' }, { name: 'Butter', amount: '80g, melted' },
      { name: 'Vanilla', amount: '2 tsp' },
    ],
    steps: [
      'Mix crackers with butter; press into springform tin base.',
      'Beat cream cheese and sugar until smooth.',
      'Add eggs one at a time; stir in sour cream and vanilla.',
      'Bake in a water bath at 160°C for 60 minutes; cool in oven with door ajar.',
    ],
  },
  {
    title: 'Fudgy Brownies',
    description: 'Ultra-chocolatey one-bowl brownies with a shiny crinkle top.',
    imageUrl: I('1603133872878-684f208fb84b'),
    prepMinutes: 35, servings: 16,
    tags: ['dessert', 'baking', 'vegetarian', 'american'],
    ingredients: [
      { name: 'Butter', amount: '170g' }, { name: 'Dark chocolate', amount: '200g' },
      { name: 'Eggs', amount: '3' }, { name: 'Sugar', amount: '280g' },
      { name: 'All-purpose flour', amount: '90g' }, { name: 'Cocoa powder', amount: '30g' },
      { name: 'Vanilla extract', amount: '1 tsp' }, { name: 'Salt', amount: 'pinch' },
    ],
    steps: [
      'Melt butter and chocolate together.',
      'Vigorously whisk in sugar and eggs until glossy.',
      'Fold in flour, cocoa and salt.',
      'Bake in a 20cm tin at 180°C for 22–24 minutes; cool fully before cutting.',
    ],
  },
  {
    title: 'Crepes with Strawberries',
    description: 'Paper-thin French crêpes with whipped cream and fresh strawberries.',
    imageUrl: I('1493770348161-369560ae357d'),
    prepMinutes: 30, servings: 4,
    tags: ['dessert', 'french', 'vegetarian', 'quick'],
    ingredients: [
      { name: 'All-purpose flour', amount: '125g' }, { name: 'Milk', amount: '300ml' },
      { name: 'Eggs', amount: '2' }, { name: 'Butter', amount: '2 tbsp, melted' },
      { name: 'Strawberries', amount: '300g, hulled' }, { name: 'Whipped cream', amount: '200ml' },
      { name: 'Sugar', amount: '2 tbsp' },
    ],
    steps: [
      'Blend flour, milk, eggs and butter until smooth; rest 20 min.',
      'Cook thin crêpes in a buttered pan, 1 min per side.',
      'Macerate strawberries with sugar.',
      'Fill crêpes with whipped cream and strawberries; fold into quarters.',
    ],
  },
  {
    title: 'Panna Cotta',
    description: 'Silky vanilla panna cotta with a ruby berry coulis.',
    imageUrl: I('1414235077428-338989a2e8c0'),
    prepMinutes: 20, servings: 4,
    tags: ['dessert', 'italian', 'gluten-free'],
    ingredients: [
      { name: 'Double cream', amount: '500ml' }, { name: 'Sugar', amount: '60g' },
      { name: 'Vanilla pod', amount: '1' }, { name: 'Gelatine leaves', amount: '3' },
      { name: 'Mixed berries', amount: '200g' }, { name: 'Icing sugar', amount: '2 tbsp' },
    ],
    steps: [
      'Soak gelatine in cold water 5 minutes.',
      'Warm cream with sugar and vanilla until just simmering.',
      'Squeeze gelatine and dissolve in cream; pour into moulds.',
      'Chill 4 hours; turn out and serve with berry coulis.',
    ],
  },
  {
    title: 'Mango Sorbet',
    description: 'Three-ingredient mango sorbet — no ice-cream machine needed.',
    imageUrl: I('1530554764233-e79e16c91d08'),
    prepMinutes: 15, servings: 6,
    tags: ['dessert', 'vegan', 'gluten-free', 'dairy-free', 'healthy'],
    ingredients: [
      { name: 'Ripe mangoes', amount: '1kg, frozen chunks' }, { name: 'Lime juice', amount: '3 tbsp' },
      { name: 'Honey or maple syrup', amount: '2 tbsp' },
    ],
    steps: [
      'Blend frozen mango with lime juice and honey until perfectly smooth.',
      'Taste and adjust sweetness.',
      'Serve immediately as soft sorbet, or freeze 2 hours for firmer scoop.',
    ],
  },
  {
    title: 'Poke Bowl',
    description: 'Hawaiian-inspired ahi tuna bowl with edamame, pickled ginger and sriracha mayo.',
    imageUrl: I('1540420773420-3366772f4999'),
    prepMinutes: 20, servings: 2,
    tags: ['asian', 'healthy', 'dairy-free', 'gluten-free', 'high-protein'],
    ingredients: [
      { name: 'Sushi-grade tuna', amount: '250g, cubed' }, { name: 'Sushi rice', amount: '200g, cooked' },
      { name: 'Edamame', amount: '80g, shelled' }, { name: 'Cucumber', amount: '½, sliced' },
      { name: 'Pickled ginger', amount: '2 tbsp' }, { name: 'Soy sauce', amount: '2 tbsp' },
      { name: 'Sriracha', amount: '1 tsp' }, { name: 'Mayonnaise', amount: '2 tbsp' },
    ],
    steps: [
      'Marinate tuna in soy sauce and sesame oil for 5 minutes.',
      'Season rice with rice vinegar.',
      'Mix sriracha into mayonnaise.',
      'Arrange tuna, edamame and cucumber over rice; drizzle sriracha mayo.',
    ],
  },
  {
    title: 'Corn Chowder',
    description: 'Chunky sweetcorn and potato chowder with smoked bacon.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 35, servings: 4,
    tags: ['soup', 'american', 'comfort-food'],
    ingredients: [
      { name: 'Sweetcorn', amount: '4 cobs or 400g canned' }, { name: 'Potatoes', amount: '400g, diced' },
      { name: 'Smoked bacon', amount: '150g' }, { name: 'Onion', amount: '1' },
      { name: 'Chicken stock', amount: '700ml' }, { name: 'Double cream', amount: '150ml' },
      { name: 'Chives', amount: 'to garnish' },
    ],
    steps: [
      'Cook bacon until crispy; remove and reserve.',
      'Sauté onion in bacon fat; add potatoes, corn and stock.',
      'Simmer 20 minutes; lightly mash to thicken.',
      'Stir in cream; top with bacon and chives.',
    ],
  },
  {
    title: 'Black Bean Soup',
    description: 'Smoky Cuban-style black bean soup with cumin and orange.',
    imageUrl: I('1547592166-23ac45744acd'),
    prepMinutes: 45, servings: 6,
    tags: ['soup', 'vegan', 'mexican', 'high-protein', 'gluten-free'],
    ingredients: [
      { name: 'Black beans', amount: '2 × 400g cans' }, { name: 'Onion', amount: '1' },
      { name: 'Garlic', amount: '4 cloves' }, { name: 'Chipotle paste', amount: '1 tbsp' },
      { name: 'Cumin', amount: '2 tsp' }, { name: 'Orange juice', amount: '60ml' },
      { name: 'Vegetable stock', amount: '750ml' }, { name: 'Coriander', amount: 'to serve' },
    ],
    steps: [
      'Sauté onion and garlic until soft.',
      'Add cumin, chipotle, beans and stock; simmer 20 minutes.',
      'Blend half the soup; stir in orange juice.',
      'Serve with coriander, sour cream and lime.',
    ],
  },
  {
    title: 'Lamb Kofta',
    description: 'Spiced minced lamb skewers grilled and served with flatbread and harissa yoghurt.',
    imageUrl: I('1495195134817-aeb325a55b65'),
    prepMinutes: 30, servings: 4,
    tags: ['mediterranean', 'high-protein', 'gluten-free', 'grilling'],
    ingredients: [
      { name: 'Ground lamb', amount: '500g' }, { name: 'Onion', amount: '½, grated' },
      { name: 'Garlic', amount: '2 cloves' }, { name: 'Cumin', amount: '1 tsp' },
      { name: 'Coriander', amount: '1 tsp, ground' }, { name: 'Cinnamon', amount: '¼ tsp' },
      { name: 'Greek yoghurt', amount: '150ml' }, { name: 'Harissa', amount: '1 tbsp' },
    ],
    steps: [
      'Mix lamb with onion, garlic and spices; chill 15 minutes.',
      'Mould onto skewers; grill 4 min per side.',
      'Mix yoghurt with harissa.',
      'Serve kofta in flatbreads with harissa yoghurt and salad.',
    ],
  },
  {
    title: 'Chicken Biryani',
    description: 'Fragrant layered rice dish with marinated chicken and crispy onions.',
    imageUrl: I('1512058564366-18510be2db19'),
    prepMinutes: 75, servings: 4,
    tags: ['indian', 'high-protein', 'gluten-free'],
    ingredients: [
      { name: 'Basmati rice', amount: '300g' }, { name: 'Chicken thighs', amount: '600g' },
      { name: 'Yoghurt', amount: '150ml' }, { name: 'Biryani spice mix', amount: '3 tbsp' },
      { name: 'Onions', amount: '2, thinly sliced' }, { name: 'Saffron', amount: 'pinch in 3 tbsp milk' },
      { name: 'Mint', amount: 'handful' },
    ],
    steps: [
      'Marinate chicken in yoghurt and spices 30 minutes.',
      'Fry onions until crispy and golden.',
      'Cook chicken in its marinade 15 minutes.',
      'Par-boil rice; layer with chicken, fried onions and saffron milk.',
      'Seal pot and steam on low heat 20 minutes.',
    ],
  },
  {
    title: 'Kung Pao Chicken',
    description: 'Sichuan stir-fry with chicken, peanuts and dried chillies.',
    imageUrl: I('1432139555190-58524dae6a55'),
    prepMinutes: 25, servings: 2,
    tags: ['asian', 'chinese', 'spicy', 'quick', 'high-protein'],
    ingredients: [
      { name: 'Chicken breast', amount: '300g, diced' }, { name: 'Dried chillies', amount: '8' },
      { name: 'Peanuts', amount: '60g' }, { name: 'Soy sauce', amount: '2 tbsp' },
      { name: 'Shaoxing wine', amount: '1 tbsp' }, { name: 'Sugar', amount: '1 tsp' },
      { name: 'Spring onions', amount: '3' }, { name: 'Sichuan peppercorns', amount: '½ tsp' },
    ],
    steps: [
      'Marinate chicken in soy, wine and cornstarch 10 min.',
      'Fry chillies and peppercorns in hot oil until fragrant.',
      'Add chicken; stir-fry until cooked.',
      'Add peanuts, sauce and spring onions; toss and serve.',
    ],
  },
];

// ---------------------------------------------------------------------------

export type PaginatedRecipes = {
  data: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availableTags: string[];
};

const ALLOWED_SORT = new Set(['title', 'prepMinutes', 'servings', 'createdAt']);

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly repo: Repository<Recipe>,
  ) {}

  async findAll(query: ListRecipesQueryDto): Promise<PaginatedRecipes> {
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      tags,
      maxPrepMinutes,
    } = query;

    const qb = this.repo.createQueryBuilder('recipe');

    if (search?.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(recipe.title) LIKE :q OR LOWER(recipe.description) LIKE :q)',
        { q },
      );
    }

    if (tags?.trim()) {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tagList.length > 0) {
        qb.andWhere(
          `EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(recipe.tags) t
            WHERE t = ANY(:tagList)
          )`,
          { tagList },
        );
      }
    }

    if (maxPrepMinutes != null) {
      qb.andWhere('recipe.prepMinutes <= :maxPrepMinutes', { maxPrepMinutes });
    }

    const col = ALLOWED_SORT.has(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`recipe.${col}`, sortOrder === 'ASC' ? 'ASC' : 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [[data, total], availableTags] = await Promise.all([
      qb.getManyAndCount(),
      this.findAllTags(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      availableTags,
    };
  }

  async findAllTags(): Promise<string[]> {
    const rows: { tag: string }[] = await this.repo.query(
      `SELECT DISTINCT jsonb_array_elements_text(tags) AS tag
       FROM recipes
       WHERE "deletedAt" IS NULL
       ORDER BY tag ASC`,
    );
    return rows.map((r) => r.tag);
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.repo.findOneBy({ id });
    if (!recipe) throw new NotFoundException(`Recipe ${id} not found`);
    return recipe;
  }

  create(dto: CreateRecipeDto): Promise<Recipe> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.findOne(id);
    Object.assign(recipe, dto);
    return this.repo.save(recipe);
  }

  async remove(id: string): Promise<void> {
    // findOne already 404s if the recipe is missing (or already soft-deleted).
    const recipe = await this.findOne(id);
    // softRemove sets deletedAt instead of issuing a DELETE. The row stays in the
    // table but is excluded from every subsequent read. Use repo.remove() for a
    // hard delete, or repo.restore(id) to bring a soft-deleted row back.
    await this.repo.softRemove(recipe);
  }

  async seed(): Promise<{ created: number }> {
    const existing = await this.repo.count();
    // Re-seed whenever the DB has fewer records than the full seed set.
    // This allows a clean reset without manual intervention.
    if (existing >= SEED_RECIPES.length) return { created: 0 };
    await this.repo.clear();
    await this.repo.save(SEED_RECIPES.map((dto) => this.repo.create(dto)));
    return { created: SEED_RECIPES.length };
  }
}
