require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Pizza = require('./models/Pizza');

const pizzas = [
  {
    name: 'Margherita Classica',
    description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil.',
    price: 249,
    category: 'Veg',
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800',
  },
  {
    name: 'Farmhouse Veggie',
    description: 'Onions, capsicum, mushrooms, tomatoes and corn on a herbed crust.',
    price: 299,
    category: 'Veg',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  },
  {
    name: 'Paneer Tikka',
    description: 'Spiced paneer, onions and bell peppers with mint mayo drizzle.',
    price: 329,
    category: 'Veg',
    imageUrl: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=800',
  },
  {
    name: 'Pepperoni Inferno',
    description: 'Double pepperoni, smoked mozzarella, chilli flakes, hot honey.',
    price: 379,
    category: 'Non-Veg',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
  },
  {
    name: 'Chicken BBQ',
    description: 'Smoky BBQ chicken, red onions, mozzarella and a tangy glaze.',
    price: 359,
    category: 'Non-Veg',
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800',
  },
  {
    name: 'Tandoori Chicken',
    description: 'Tandoori marinated chicken, onions and coriander on a tikka base.',
    price: 389,
    category: 'Non-Veg',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
  },
  {
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms, truffle oil, parmesan and rocket leaves.',
    price: 449,
    category: 'Specialty',
    imageUrl: 'https://images.unsplash.com/photo-1548365328-9f547fb09530?w=800',
  },
  {
    name: 'Four Cheese',
    description: 'Mozzarella, cheddar, parmesan and gorgonzola on a buttery crust.',
    price: 419,
    category: 'Specialty',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
  },
  {
    name: 'Meat Lovers Supreme',
    description: 'Pepperoni, sausage, bacon and ham — for the carnivores.',
    price: 479,
    category: 'Specialty',
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800',
  },
  {
    name: 'Spinach & Feta',
    description: 'Baby spinach, crumbled feta, garlic and a hint of lemon zest.',
    price: 319,
    category: 'Veg',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
  },
];

(async () => {
  await connectDB();

  await Pizza.deleteMany({});
  await Pizza.insertMany(pizzas);
  console.log(`✅ Seeded ${pizzas.length} pizzas`);

  const adminEmail = 'admin@pizzapalace.test';
  const adminPass = 'Admin@12345';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Pizza Palace Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPass, 10),
      role: 'admin',
    });
  } else {
    admin.role = 'admin';
    await admin.save();
  }

  const customerEmail = 'demo@pizzapalace.test';
  const customerPass = 'Demo@12345';
  let customer = await User.findOne({ email: customerEmail });
  if (!customer) {
    customer = await User.create({
      name: 'Demo Customer',
      email: customerEmail,
      passwordHash: await bcrypt.hash(customerPass, 10),
    });
  }

  console.log('\n👤 Demo accounts:');
  console.log(`   Admin    -> ${adminEmail}  /  ${adminPass}`);
  console.log(`   Customer -> ${customerEmail}  /  ${customerPass}\n`);

  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});