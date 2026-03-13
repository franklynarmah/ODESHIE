import { initDb, persistDb } from './db.js';
import db from './db.js';

const products = [
  // New Arrivals
  {
    name: 'Senegalese Head Beads',
    description: 'Handcrafted Senegalese head beads made with traditional techniques passed down through generations. These vibrant beads are perfect for adding an authentic African touch to any outfit. Each piece is unique, carefully crafted by skilled artisans using high-quality materials.',
    price: 120,
    original_price: 120,
    discount_percent: 0,
    category: 'Accessories',
    is_new_arrival: 1,
    is_on_sale: 0,
    rating: 0,
    review_count: 0,
    stock: 50,
    colors: JSON.stringify(['Gold', 'Red', 'Blue', 'Multi']),
    sizes: JSON.stringify(['One Size']),
    image_url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop'
  },
  {
    name: 'Ankara Top',
    description: 'A stunning Ankara top crafted from vibrant African wax print fabric. This top features a modern silhouette with traditional African patterns, making it perfect for both casual and semi-formal occasions. The bold, colorful design celebrates the rich textile heritage of West Africa.',
    price: 150,
    original_price: 150,
    discount_percent: 0,
    category: 'Tops',
    is_new_arrival: 1,
    is_on_sale: 0,
    rating: 4.0,
    review_count: 12,
    stock: 75,
    colors: JSON.stringify(['Blue/Yellow', 'Red/Green', 'Orange/Black']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4d05?w=400&h=400&fit=crop'
  },
  {
    name: 'Boubou Dress',
    description: 'The Boubou is a flowing, elegant garment originating from West Africa. This stunning dress features intricate embroidery and is made from luxurious fabric that drapes beautifully. Perfect for celebrations, ceremonies, or any occasion where you want to make a statement.',
    price: 300,
    original_price: 300,
    discount_percent: 0,
    category: 'Dresses',
    is_new_arrival: 1,
    is_on_sale: 0,
    rating: 2.0,
    review_count: 8,
    stock: 30,
    colors: JSON.stringify(['White/Gold', 'Blue/Silver', 'Purple/Gold']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&h=400&fit=crop'
  },
  {
    name: 'Zulu Beaded Purse',
    description: 'An authentic Zulu beaded purse handcrafted by skilled artisans from South Africa. This beautiful accessory features traditional Zulu beadwork patterns that carry cultural significance and stories. Made with durable materials and meticulous attention to detail.',
    price: 70,
    original_price: 70,
    discount_percent: 0,
    category: 'Accessories',
    is_new_arrival: 1,
    is_on_sale: 0,
    rating: 3.0,
    review_count: 15,
    stock: 40,
    colors: JSON.stringify(['Red/White', 'Blue/White', 'Multi-color']),
    sizes: JSON.stringify(['One Size']),
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'
  },
  {
    name: 'Fulani Milk Bowl',
    description: 'A traditional Fulani milk bowl (calabash) intricately decorated with geometric patterns and brass studs. This decorative piece represents the rich nomadic culture of the Fulani people of West Africa. Each bowl is hand-carved and decorated, making every piece unique.',
    price: 350,
    original_price: 350,
    discount_percent: 0,
    category: 'Accessories',
    is_new_arrival: 1,
    is_on_sale: 0,
    rating: 4.0,
    review_count: 6,
    stock: 20,
    colors: JSON.stringify(['Natural/Brown', 'Dark/Brass']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large']),
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  },
  // Sales items
  {
    name: 'Moroccan Argan Oil',
    description: 'Pure, cold-pressed Moroccan Argan Oil sourced directly from cooperatives in the Souss Valley of Morocco. Known as "liquid gold", this precious oil is rich in vitamin E and essential fatty acids. Use it for hair, skin, and nail care.',
    price: 50,
    original_price: 62.50,
    discount_percent: 20,
    category: 'Accessories',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 3.0,
    review_count: 22,
    stock: 100,
    colors: JSON.stringify(['Natural']),
    sizes: JSON.stringify(['50ml', '100ml', '200ml']),
    image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
  },
  {
    name: 'Sudanese Bridal Toub',
    description: 'The Toub is a traditional Sudanese garment worn by women for weddings and celebrations. This beautiful bridal Toub is crafted from fine fabric with intricate gold embroidery along the borders. It is a symbol of Sudanese cultural identity and elegance.',
    price: 100,
    original_price: 125,
    discount_percent: 20,
    category: 'Dresses',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 1.0,
    review_count: 4,
    stock: 15,
    colors: JSON.stringify(['White/Gold', 'Cream/Silver', 'Pink/Gold']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1614786269829-d24616faf56d?w=400&h=400&fit=crop'
  },
  {
    name: 'Moroccan Berber Rug',
    description: 'A genuine hand-woven Moroccan Berber rug (Beni Ourain style) crafted by Berber women in the Atlas Mountains. These rugs feature traditional geometric patterns that have been used for centuries. Made from natural wool.',
    price: 30,
    original_price: 37.50,
    discount_percent: 20,
    category: 'Accessories',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 3.0,
    review_count: 18,
    stock: 25,
    colors: JSON.stringify(['Ivory/Black', 'Beige/Brown', 'White/Grey']),
    sizes: JSON.stringify(['Small (2x3ft)', 'Medium (4x6ft)', 'Large (6x9ft)']),
    image_url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop'
  },
  {
    name: 'Kanzu',
    description: 'The Kanzu is a traditional white garment worn by men in East Africa, particularly in Tanzania, Uganda, and Kenya. This elegant piece is made from high-quality cotton and features simple, clean lines that exude sophistication. Traditionally worn for religious occasions and weddings.',
    price: 70,
    original_price: 87.50,
    discount_percent: 20,
    category: 'Tops',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 2.0,
    review_count: 9,
    stock: 45,
    colors: JSON.stringify(['White', 'Cream', 'Light Blue']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large', 'XX-Large']),
    image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop'
  },
  {
    name: 'Takchita',
    description: 'A Takchita is a luxurious two-piece Moroccan garment consisting of a fine inner dress topped with an elaborately decorated outer kaftan. This magnificent piece features intricate hand-embroidered details, sfifa trim along the neckline and sleeves.',
    price: 70,
    original_price: 87.50,
    discount_percent: 20,
    category: 'Dresses',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 5.0,
    review_count: 31,
    stock: 20,
    colors: JSON.stringify(['Gold/Cream', 'Royal Blue/Gold', 'Emerald/Gold']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?w=400&h=400&fit=crop'
  },
  {
    name: 'Buba Blouse',
    description: 'A Buba is a traditional Yoruba blouse from Nigeria, characterized by its loose, flowing shape with wide, open sleeves and a square or round neckline. It is typically made from luxurious materials like Aso Oke (hand-woven cloth), lace, or Ankara (African wax print).',
    price: 75,
    original_price: 100,
    discount_percent: 25,
    category: 'Tops',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 4.0,
    review_count: 27,
    stock: 60,
    colors: JSON.stringify(['Aso Oke Gold', 'Ankara Blue', 'Lace White', 'Lace Purple']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&h=400&fit=crop'
  },
  {
    name: 'Roba Oromo',
    description: 'The Roba is a traditional Oromo garment from Ethiopia, known for its striking beauty and cultural significance. Made from fine cotton and adorned with colorful embroidery along the borders, this dress represents the proud heritage of the Oromo people.',
    price: 120,
    original_price: 150,
    discount_percent: 20,
    category: 'Dresses',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 4.0,
    review_count: 14,
    stock: 35,
    colors: JSON.stringify(['White/Red', 'White/Blue', 'White/Multi']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop'
  },
  {
    name: 'South African Male Romper',
    description: 'A contemporary take on traditional South African fashion, this male romper combines modern design with African textile patterns. Made from lightweight, breathable fabric perfect for warm weather, featuring bold African prints and a comfortable, relaxed fit.',
    price: 100,
    original_price: 125,
    discount_percent: 20,
    category: 'Tops',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 3.0,
    review_count: 11,
    stock: 40,
    colors: JSON.stringify(['Kente Gold/Green', 'Ndebele Multi', 'Shweshwe Blue']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400&h=400&fit=crop'
  },
  {
    name: 'Traditional Guinea Blouse',
    description: 'A beautiful traditional blouse from Guinea, West Africa, crafted from authentic Guinea brocade fabric known for its distinctive woven patterns and rich colors. Features traditional embroidery details and a flattering silhouette.',
    price: 70,
    original_price: 87.50,
    discount_percent: 20,
    category: 'Tops',
    is_new_arrival: 0,
    is_on_sale: 1,
    rating: 2.0,
    review_count: 7,
    stock: 55,
    colors: JSON.stringify(['Purple/Gold', 'Green/Gold', 'Navy/Silver']),
    sizes: JSON.stringify(['Small', 'Medium', 'Large', 'X-Large']),
    image_url: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop'
  }
];

const reviews = [
  { product_id: 2, reviewer_name: 'Abena K.', rating: 5, comment: 'Absolutely love this Ankara top! The fabric quality is excellent and the colors are vibrant. Got so many compliments wearing it.' },
  { product_id: 2, reviewer_name: 'Yaw M.', rating: 4, comment: 'Great quality and fast shipping. The fit is perfect. Will definitely order more.' },
  { product_id: 2, reviewer_name: 'Efua A.', rating: 3, comment: 'Nice top but the sizing runs a bit large. I would recommend ordering one size down.' },
  { product_id: 3, reviewer_name: 'Akosua T.', rating: 3, comment: 'Beautiful dress but took longer to arrive than expected. The quality is good though.' },
  { product_id: 3, reviewer_name: 'Kwame D.', rating: 1, comment: 'The color was slightly different from the picture. Still wearable but a bit disappointed.' },
  { product_id: 5, reviewer_name: 'Ama B.', rating: 5, comment: 'This milk bowl is a stunning piece of art! Perfect for my living room decor.' },
  { product_id: 5, reviewer_name: 'Kofi S.', rating: 3, comment: 'Good quality craftsmanship. The brass studs are beautifully done.' },
  { product_id: 10, reviewer_name: 'Fatima H.', rating: 5, comment: 'The Takchita is absolutely breathtaking! I wore it to a wedding and everyone was asking where I got it.' },
  { product_id: 10, reviewer_name: 'Zineb M.', rating: 5, comment: 'Perfect quality, exactly as described. The embroidery detail is exquisite.' },
  { product_id: 10, reviewer_name: 'Nadia R.', rating: 5, comment: 'I am in love with this dress. The craftsmanship is outstanding.' },
  { product_id: 11, reviewer_name: 'Ngozi O.', rating: 5, comment: 'This Buba is everything! The Aso Oke fabric is authentic and the fit is perfect.' },
  { product_id: 11, reviewer_name: 'Chisom E.', rating: 4, comment: 'Love the quality of the fabric. Very comfortable and stylish.' },
  { product_id: 11, reviewer_name: 'Adaeze N.', rating: 3, comment: 'Good product but the delivery took 2 weeks.' }
];

async function seed() {
  await initDb();

  console.log('Clearing existing data...');
  db.exec('DELETE FROM reviews');
  db.exec('DELETE FROM cart_items');
  db.exec('DELETE FROM wishlist');
  db.exec('DELETE FROM products');

  console.log('Inserting products...');
  for (const product of products) {
    db.prepare(`
      INSERT INTO products (name, description, price, original_price, discount_percent, category, is_new_arrival, is_on_sale, rating, review_count, stock, colors, sizes, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      product.name, product.description, product.price, product.original_price,
      product.discount_percent, product.category, product.is_new_arrival, product.is_on_sale,
      product.rating, product.review_count, product.stock, product.colors, product.sizes, product.image_url
    );
  }

  console.log('Inserting reviews...');
  for (const review of reviews) {
    db.prepare(`
      INSERT INTO reviews (product_id, reviewer_name, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(review.product_id, review.reviewer_name, review.rating, review.comment);
  }

  persistDb();
  console.log(`Database seeded successfully!`);
  console.log(`Inserted ${products.length} products and ${reviews.length} reviews.`);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
