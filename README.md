# BookIt Backend API

Simple booking API for travel experiences. No database needed - works out of the box!

## Quick Start

```bash
npm install
npm start
```

That's it! API runs at `http://localhost:5000`

## What You Get

- 9 ready-to-use experiences (Kayaking, Hiking, Coffee Trail, etc.)
- Time slots for next 5 days
- Working promo codes: `SAVE10`, `FLAT100`, `FIRST20`
- Full booking system

All data is pre-loaded, no setup needed.

## Test It

Open your browser:
```
http://localhost:5000/experiences
```

You'll see all 9 experiences ready to use.

## API Endpoints

```
GET  /experiences          - Get all experiences
GET  /experiences/:id      - Get experience with time slots
POST /bookings             - Create a booking
POST /promo/validate       - Check promo code
```

### Create Booking Example

```javascript
fetch('http://localhost:5000/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    experienceId: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    date: '2025-11-05',
    time: '09:00 am',
    quantity: 1,
    promoCode: 'SAVE10'  // optional
  })
})
```

Returns a booking reference like `HUF56ASO`.

## Promo Codes

- `SAVE10` - 10% off
- `FLAT100` - ₹100 off  
- `FIRST20` - 20% off

## Tech Stack

- Node.js + Express
- MongoDB (optional - uses dummy data by default)

## That's It!

You now have a working booking API. Connect your frontend and start building.

Want MongoDB later? Add a connection string to `.env` and restart. Same code, real database.
