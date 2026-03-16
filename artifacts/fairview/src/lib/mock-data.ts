// Shared mock data since API doesn't define properties
export type PropertyCategory = "land" | "property" | "apartment" | "shop";

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  price: string;
  location: string;
  size: string;
  description: string;
  features: string[];
  mainImage: string;
  gallery: string[];
  videoUrl: string;
}

export const MOCK_PROPERTIES: Property[] = [
  // Lands
  {
    id: "land-1",
    title: "Prime 600sqm Plot in Lekki Phase 1",
    category: "land",
    price: "₦150,000,000",
    location: "Lekki Phase 1, Lagos",
    size: "600 sqm",
    description: "Dry, fully fenced and gated plot in a highly secured estate. Perfect for a luxury duplex or multi-family development. Title: C of O.",
    features: ["Fenced", "Dry Land", "Tarred Road", "Secured Estate"],
    mainImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&q=80",
      "https://images.unsplash.com/photo-1629196914216-1f912e753c15?w=400&q=80",
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&q=80",
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "land-2",
    title: "Acres of Farmland in Epe",
    category: "land",
    price: "₦15,000,000 per acre",
    location: "Epe, Lagos",
    size: "1 Acre",
    description: "Fertile land perfect for agriculture or future land banking. Located 15 mins from the proposed international airport.",
    features: ["Fertile", "Accessible", "High ROI Potential"],
    mainImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&q=80",
      "https://images.unsplash.com/photo-1629196914216-1f912e753c15?w=400&q=80",
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&q=80",
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "land-3",
    title: "Corner Piece Plot in Maitama",
    category: "land",
    price: "₦400,000,000",
    location: "Maitama, Abuja",
    size: "1200 sqm",
    description: "Premium corner piece plot in the heart of Maitama. Ready to build with all approvals in place.",
    features: ["Corner Piece", "Central Location", "All Approvals"],
    mainImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&q=80",
      "https://images.unsplash.com/photo-1629196914216-1f912e753c15?w=400&q=80",
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&q=80",
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },

  // Properties for Sale
  {
    id: "prop-1",
    title: "5 Bedroom Fully Detached Duplex",
    category: "property",
    price: "₦250,000,000",
    location: "Ikoyi, Lagos",
    size: "450 sqm",
    description: "Luxury 5-bedroom duplex with a swimming pool, BQ, fully fitted kitchen, and smart home automation.",
    features: ["5 Beds", "6 Baths", "Pool", "Smart Home", "BQ"],
    mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687931-cecebd802404?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "prop-2",
    title: "Modern 4 Bedroom Terrace",
    category: "property",
    price: "₦120,000,000",
    location: "Chevron Drive, Lekki",
    size: "300 sqm",
    description: "Beautifully finished 4-bedroom terrace duplex in a secure family-friendly neighborhood.",
    features: ["4 Beds", "5 Baths", "Fitted Kitchen", "24/7 Power"],
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687931-cecebd802404?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "prop-3",
    title: "Luxury 3 Bedroom Bungalow",
    category: "property",
    price: "₦45,000,000",
    location: "Parakin, Ile-Ife",
    size: "500 sqm",
    description: "Brand new 3-bedroom bungalow with ample parking space and modern finishing in a serene environment.",
    features: ["3 Beds", "3 Baths", "Ample Parking", "POP Ceiling"],
    mainImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687931-cecebd802404?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },

  // Apartments for Rent
  {
    id: "apt-1",
    title: "Spacious 2 Bedroom Apartment",
    category: "apartment",
    price: "₦3,500,000 / year",
    location: "Victoria Island, Lagos",
    size: "150 sqm",
    description: "Serviced 2-bedroom apartment with a city view, gym, and 24/7 power supply.",
    features: ["2 Beds", "Serviced", "Gym", "Elevator"],
    mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=400&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },

  // Shops for Lease
  {
    id: "shop-1",
    title: "Premium Retail Space",
    category: "shop",
    price: "₦5,000,000 / year",
    location: "Wuse II, Abuja",
    size: "80 sqm",
    description: "High-traffic retail space in a premium shopping mall. Perfect for boutique or electronics store.",
    features: ["High Traffic", "Security", "Backup Power", "Glass Display"],
    mainImage: "https://images.unsplash.com/photo-1582036573752-fb51654e5659?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=400&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export const MOCK_REVIEWS = [
  { name: "Chinedu O.", text: "Living here has been a breeze. Maintenance is top-notch!", rating: 5 },
  { name: "Aisha M.", text: "The security and peace of mind is exactly what I was looking for.", rating: 5 },
  { name: "Tunde B.", text: "Spacious rooms and great natural lighting. Highly recommend.", rating: 4 },
];
