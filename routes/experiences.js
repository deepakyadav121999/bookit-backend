const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const Slot = require('../models/Slot');

// Dummy data matching the Figma design
const dummyExperiences = [
  {
    _id: '1',
    title: 'Kayaking',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
    location: 'Ullal',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    category: 'Ullal',
    duration: 60,
    highlights: 'Scenic routes, trained guides, safety equipment included. Minimum age 10.',
    isActive: true
  },
  {
    _id: '2',
    title: 'Kayaking',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Ullal Karamake',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
    category: 'Ullal Karamake',
    duration: 60,
    highlights: 'Scenic routes, trained guides, safety equipment included.',
    isActive: true
  },
  {
    _id: '3',
    title: 'Kayaking',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Ullal Karamake',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80',
    category: 'Ullal Karamake',
    duration: 60,
    highlights: 'Adventure experience with professional guidance.',
    isActive: true
  },
  {
    _id: '4',
    title: 'Nandi Hills Sunrise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Bangalore',
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    category: 'Bangalore',
    duration: 180,
    highlights: 'Early morning trek, sunrise photography, breakfast included',
    isActive: true
  },
  {
    _id: '5',
    title: 'Coffee Trail',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Coorg',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
    category: 'Coorg',
    duration: 240,
    highlights: 'Coffee tasting, plantation tour, local cuisine',
    isActive: true
  },
  {
    _id: '6',
    title: 'Nandi Hills Sunrise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Bangalore',
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    category: 'Bangalore',
    duration: 180,
    highlights: 'Breathtaking views and photography opportunities',
    isActive: true
  },
  {
    _id: '7',
    title: 'Boat Cruise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Sconsvint',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    category: 'Sconsvint',
    duration: 120,
    highlights: 'Sunset views, refreshments, guided commentary',
    isActive: true
  },
  {
    _id: '8',
    title: 'Bungee Jumping',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Malad',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    category: 'Malad',
    duration: 90,
    highlights: 'Professional instructors, safety certified, gopro recording included',
    isActive: true
  },
  {
    _id: '9',
    title: 'Coffee Trail',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Gorg',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    category: 'Gorg',
    duration: 240,
    highlights: 'Coffee plantation exploration and tasting',
    isActive: true
  }
];

// GET all experiences
router.get('/', async (req, res) => {
  const { search } = req.query;
  
  // Use dummy data directly for simplicity
  let experiences = [...dummyExperiences];
  
  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase();
    experiences = experiences.filter(exp => 
      exp.title.toLowerCase().includes(searchLower) ||
      exp.description.toLowerCase().includes(searchLower) ||
      exp.location.toLowerCase().includes(searchLower) ||
      exp.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Always map _id to id for frontend compatibility
  res.json(experiences.map(exp => ({
    ...exp,
    id: exp._id
  })));
});

// Helper function to generate dummy slots
function generateDummySlots(experienceId) {
  const slots = [];
  const today = new Date();
  
  // Generate slots for next 5 days
  for (let day = 0; day < 5; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    // Create 3 time slots per day
    const times = [
      { start: '07:00 am', end: '08:00 am', label: 'wait' },
      { start: '09:00 am', end: '10:00 am', label: 'wait' },
      { start: '11:00 am', end: '12:00 pm', label: 'wait' }
    ];

    times.forEach((time, idx) => {
      slots.push({
        _id: `slot-${experienceId}-${day}-${idx}`,
        experienceId: experienceId,
        date: date.toISOString().split('T')[0],
        startTime: time.start,
        endTime: time.end,
        capacity: 10,
        bookedCount: 0,
        isAvailable: true,
        label: time.label
      });
    });
  }
  
  return slots;
}

// GET experience by ID with slots
router.get('/:id', async (req, res) => {
  // Use dummy data directly for simplicity
  const dummyExp = dummyExperiences.find(exp => exp._id === req.params.id);
  
  if (!dummyExp) {
    return res.status(404).json({ message: 'Experience not found' });
  }
  
  // Generate slots for this experience
  const slots = generateDummySlots(req.params.id).map(slot => ({
    ...slot,
    id: slot._id
  }));
  
  // Return experience with slots and proper id mapping
  res.json({
    ...dummyExp,
    id: dummyExp._id,
    slots
  });
});

// POST seed data
router.post('/seed', async (req, res) => {
  try {
    const count = await Experience.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Data already seeded' });
    }

    const experiences = [
      {
        title: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
        location: 'Ullal',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        category: 'Ullal',
        duration: 60,
        highlights: 'Scenic routes, trained guides, safety equipment included. Minimum age 10.',
      },
      {
        title: 'Nandi Hills Sunrise',
        description: 'Experience the breathtaking sunrise from Nandi Hills. Perfect for photography enthusiasts and nature lovers.',
        location: 'Bangalore',
        price: 899,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        category: 'Bangalore',
        duration: 180,
        highlights: 'Early morning trek, sunrise photography, breakfast included',
      },
      {
        title: 'Coffee Trail',
        description: 'Explore the coffee plantations and learn about the journey from bean to cup.',
        location: 'Coorg',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
        category: 'Coorg',
        duration: 240,
        highlights: 'Coffee tasting, plantation tour, local cuisine',
      },
      {
        title: 'Boat Cruise',
        description: 'Enjoy a relaxing boat cruise with scenic views and refreshments.',
        location: 'Sconsvint',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        category: 'Sconsvint',
        duration: 120,
        highlights: 'Sunset views, refreshments, guided commentary',
      },
      {
        title: 'Bungee Jumping',
        description: 'Take the ultimate leap of faith with our professional bungee jumping experience.',
        location: 'Malad',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1581099599511-96e0d7c36c78?w=800',
        category: 'Malad',
        duration: 90,
        highlights: 'Professional instructors, safety certified, gopro recording included',
      },
    ];

    const createdExperiences = await Experience.insertMany(experiences);

    // Create slots for each experience
    const slots = [];
    const today = new Date();
    
    for (const exp of createdExperiences) {
      // Create slots for next 7 days
      for (let day = 1; day <= 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        
        // Create 4 time slots per day
        const times = [
          { start: '07:00', end: '08:00' },
          { start: '09:00', end: '10:00' },
          { start: '11:00', end: '12:00' },
          { start: '13:00', end: '14:00' },
        ];

        for (const time of times) {
          slots.push({
            experienceId: exp._id,
            date: date,
            startTime: time.start,
            endTime: time.end,
            capacity: 10,
            bookedCount: 0,
            isAvailable: true
          });
        }
      }
    }

    await Slot.insertMany(slots);

    res.json({ 
      message: 'Data seeded successfully', 
      experiencesCount: createdExperiences.length,
      slotsCount: slots.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding data', error: error.message });
  }
});

module.exports = router;

