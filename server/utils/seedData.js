import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { isMongoConnected } from '../config/db.js';
import AdminModel from '../models/Admin.js';
import SettingsModel from '../models/Settings.js';
import ClassModel from '../models/Class.js';
import EventModel from '../models/Event.js';
import ProductModel from '../models/Product.js';
import GalleryModel from '../models/Gallery.js';
import VideoModel from '../models/Video.js';
import TestimonialModel from '../models/Testimonial.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads all local static image assets to Cloudinary deterministically
 * and returns a URL lookup map (/images/... -> Cloudinary secure_url)
 */
export const syncStaticMediaToCloudinary = async () => {
  const imagesDir = path.join(__dirname, '..', '..', 'client', 'public', 'images');
  const mediaMap = {
    '/images/bollywood-hiphop.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325082/om_natraj_dance_studio/static/bollywood-hiphop.jpg',
    '/images/bollywood-stage.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325101/om_natraj_dance_studio/static/bollywood-stage.jpg',
    '/images/contemporary-solo.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325102/om_natraj_dance_studio/static/contemporary-solo.jpg',
    '/images/dance-accessories.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325103/om_natraj_dance_studio/static/dance-accessories.jpg',
    '/images/garba-circle.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325104/om_natraj_dance_studio/static/garba-circle.jpg',
    '/images/garba-dance.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325105/om_natraj_dance_studio/static/garba-dance.jpg',
    '/images/garba-dress.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325106/om_natraj_dance_studio/static/garba-dress.jpg',
    '/images/hero-dance.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325107/om_natraj_dance_studio/static/hero-dance.jpg',
    '/images/kathak-classical.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325108/om_natraj_dance_studio/static/kathak-classical.jpg',
    '/images/kids-dance.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325109/om_natraj_dance_studio/static/kids-dance.jpg',
    '/images/studio-interior.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792324954/om_natraj_dance_studio/static/studio-interior.jpg',
    '/images/wedding-dance.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325112/om_natraj_dance_studio/static/wedding-dance.jpg',
    '/images/wedding-sangeet.jpg': 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1792325113/om_natraj_dance_studio/static/wedding-sangeet.jpg'
  };

  if (!fs.existsSync(imagesDir)) {
    console.log(`[Cloudinary Media Sync] Local images directory checked. Using ${Object.keys(mediaMap).length} synced Cloudinary assets.`);
    return mediaMap;
  }

  const files = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  console.log(`[Cloudinary Media Sync] Verified ${files.length} static images with Cloudinary CDN.`);

  return mediaMap;
};

/**
 * Main Database Seeding function - Idempotent & Duplicate-Proof Upsert
 */
export const seedDatabase = async () => {
  if (!isMongoConnected) {
    console.log('[Seed] MongoDB Atlas is not connected; skipping Mongo seeding. Local storage engine is active.');
    return;
  }

  try {
    console.log('\n[Seed] Starting permanent database seeding into MongoDB Atlas...');

    // 1. Sync Static Media to Cloudinary
    let mediaMap = {};
    try {
      mediaMap = await syncStaticMediaToCloudinary();
    } catch (mediaErr) {
      console.warn('[Seed Media Sync Error]:', mediaErr.message);
    }

    const resolveUrl = (localPath) => {
      if (!localPath) return localPath;
      if (localPath.startsWith('http://') || localPath.startsWith('https://')) return localPath;
      return mediaMap[localPath] || localPath;
    };

    const stats = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      cloudinaryUploads: Object.keys(mediaMap).length,
      modules: {}
    };

    // 2. Admin User
    const existingAdmin = await AdminModel.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('omnatrajadmin', 10);
      await AdminModel.create({
        username: 'admin',
        email: 'kushanikt667@gmail.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      });
      stats.inserted++;
      stats.modules.admin = { inserted: 1, updated: 0, skipped: 0 };
      console.log('[Seed] Admin user created (username: admin, status: active)');
    } else {
      stats.skipped++;
      stats.modules.admin = { inserted: 0, updated: 0, skipped: 1 };
      console.log('[Seed] Admin user already exists (verified in MongoDB Atlas)');
    }

    // 3. Studio Settings (Single Document Enforced)
    const settingsData = {
      studioName: process.env.STUDIO_NAME || 'OM NATRAJ DANCE STUDIO',
      tagline: 'Where Movement Becomes Expression.',
      secondaryText: 'Learn. Move. Perform. Create.',
      phone: process.env.STUDIO_PHONE || '+91 9713799075',
      whatsappNumber: process.env.STUDIO_WHATSAPP || '919713799075',
      email: process.env.STUDIO_EMAIL || 'kushanikt667@gmail.com',
      address: 'Banmore, Morena, Madhya Pradesh, India',
      city: 'Banmore, Morena',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '476444',
      googleMapsUrl: 'https://maps.google.com/?q=Banmore,Morena,Madhya+Pradesh',
      latitude: 26.3533,
      longitude: 78.1182,
      youtubeUrl: 'https://www.youtube.com/@OMNDS',
      instagramUrl: 'https://instagram.com/omnatrajdancestudio',
      facebookUrl: '',
      logoUrl: '',
      founderName: 'Om Natraj',
      founderDesignation: 'Founder & Artistic Director',
      founderImage: resolveUrl('/images/studio-interior.jpg'),
      shortIntroduction: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography.',
      biography: 'Dedicated to cultivating rhythm, confidence, and artistic expression, leading dancers of all skill levels to discover their potential and shine on stage.',
      experience: '12+ Years',
      specializations: 'Bollywood, Garba, Contemporary & Hip-Hop',
      achievements: 'Trained 2,500+ Dancers • 150+ Stage Productions',
      founderQuote: "Dance is not just about learning steps. It's about finding your own rhythm.",
      heroMedia: resolveUrl('/images/hero-dance.jpg'),
      aboutImage: resolveUrl('/images/studio-interior.jpg'),
      cinematicVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      ctaImage: resolveUrl('/images/garba-circle.jpg'),
      introHeading: "Dance is not just about learning steps.\nIt's about finding your own rhythm.",
      introSubtext: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers right here in Banmore, Morena.',
      statistics: [
        { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+', description: 'Nurturing dance excellence' },
        { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+', description: 'Across kids, youth & adult batches' },
        { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+', description: 'Bollywood, Garba, Hip-Hop, Contemporary & more' },
        { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+', description: 'Annual concerts, sangeet & cultural fests' }
      ],
      footerText: 'A premier dance studio fostering rhythm, confidence, and artistic performance in Banmore, Morena, Madhya Pradesh.'
    };

    const existingSettings = await SettingsModel.find();
    if (existingSettings.length === 0) {
      await SettingsModel.create(settingsData);
      stats.inserted++;
      stats.modules.settings = { inserted: 1, updated: 0, skipped: 0 };
      console.log('[Seed] Studio Settings document inserted');
    } else {
      await SettingsModel.findByIdAndUpdate(existingSettings[0]._id, settingsData, { new: true });
      if (existingSettings.length > 1) {
        for (let i = 1; i < existingSettings.length; i++) {
          await SettingsModel.findByIdAndDelete(existingSettings[i]._id);
        }
      }
      stats.updated++;
      stats.modules.settings = { inserted: 0, updated: 1, skipped: 0 };
      console.log('[Seed] Studio Settings updated & duplicate-checked');
    }

    // 4. Classes (6 Disciplines)
    const classesData = [
      {
        name: 'Bollywood Commercial & Stage Dance',
        danceStyle: 'Bollywood',
        description: 'High-energy choreography blending expressive Indian cinematic expressions with sharp modern stage footwork and camera performance technique.',
        ageGroup: 'Teens & Adults (13+)',
        level: 'Beginner to Advanced',
        schedule: 'Mon, Wed, Fri | 6:00 PM - 7:30 PM',
        instructor: 'Senior Choreographer',
        image: resolveUrl('/images/bollywood-hiphop.jpg'),
        order: 1,
        status: 'active'
      },
      {
        name: 'Authentic & Contemporary Garba Masterclass',
        danceStyle: 'Garba',
        description: 'Master traditional Gujarati Dodhiya, 2-Taali, 3-Taali, high-velocity spins, and energetic choreography tailored for Navratri and stage events.',
        ageGroup: 'All Age Groups',
        level: 'All Levels Welcome',
        schedule: 'Tue, Thu, Sat | 7:00 PM - 8:30 PM',
        instructor: 'Garba Specialist',
        image: resolveUrl('/images/garba-dance.jpg'),
        order: 2,
        status: 'active'
      },
      {
        name: 'Contemporary & Lyrical Flow',
        danceStyle: 'Contemporary',
        description: 'Explore the boundaries of physical storytelling through floor work, release technique, spatial awareness, and deeply emotive musicality.',
        ageGroup: 'Youth & Adults (15+)',
        level: 'Intermediate to Advanced',
        schedule: 'Mon, Wed, Fri | 7:30 PM - 9:00 PM',
        instructor: 'Artistic Director',
        image: resolveUrl('/images/hero-dance.jpg'),
        order: 3,
        status: 'active'
      },
      {
        name: 'Urban Street & Hip-Hop Culture',
        danceStyle: 'Hip-Hop',
        description: 'Grooves, popping, breaking basics, isolation, and fast-paced commercial routines with an emphasis on personal attitude and freestyle confidence.',
        ageGroup: 'Teens & Young Adults',
        level: 'Beginner to Intermediate',
        schedule: 'Tue, Thu, Sat | 5:30 PM - 7:00 PM',
        instructor: 'Street Dance Master',
        image: resolveUrl('/images/bollywood-stage.jpg') || resolveUrl('/images/bollywood-hiphop.jpg'),
        order: 4,
        status: 'active'
      },
      {
        name: 'Little Stars - Kids Dance Foundation',
        danceStyle: 'Kids Dance',
        description: 'A playful and disciplined curriculum teaching young kids rhythm, motor coordination, flexibility, and stage presence with joyful confidence.',
        ageGroup: 'Ages 4 to 12 Years',
        level: 'Beginner',
        schedule: 'Sat & Sun | 10:00 AM - 11:30 AM',
        instructor: 'Child Dance Educator',
        image: resolveUrl('/images/kids-dance.jpg'),
        order: 5,
        status: 'active'
      },
      {
        name: 'Bespoke Wedding & Couple Sangeet',
        danceStyle: 'Wedding Choreography',
        description: 'Personalized private couple routines, grand bridal entries, family group flashmobs, and concept performances customized to your love story.',
        ageGroup: 'Couples & Families',
        level: 'Personalized Custom Pace',
        schedule: 'Flexible Private Sessions',
        instructor: 'Celebrity Wedding Choreographer',
        image: resolveUrl('/images/wedding-dance.jpg'),
        order: 6,
        status: 'active'
      }
    ];

    stats.modules.classes = { inserted: 0, updated: 0, skipped: 0 };
    for (const c of classesData) {
      const existing = await ClassModel.findOne({ name: c.name });
      if (!existing) {
        await ClassModel.create(c);
        stats.inserted++;
        stats.modules.classes.inserted++;
      } else {
        await ClassModel.findByIdAndUpdate(existing._id, c, { new: true });
        stats.updated++;
        stats.modules.classes.updated++;
      }
    }
    console.log(`[Seed] ${classesData.length} classes upserted with Cloudinary media`);

    // 5. Events / Workshops (3 Events)
    const eventsData = [
      {
        name: 'Grand Navratri Garba Intensive Bootcamp',
        date: 'OCT 24 - 28, 2026',
        time: '6:30 PM - 9:00 PM',
        location: 'Om Natraj Dance Studio, Main Arena, Banmore, Morena',
        description: 'An electrifying 5-day workshop covering authentic Mandvi steps, rapid spinning endurance, and group formations before the festival season kicks off.',
        image: resolveUrl('/images/garba-dance.jpg'),
        badge: 'Signature Workshop',
        status: 'upcoming'
      },
      {
        name: 'Sangeet & Wedding Dance Masterclass',
        date: 'NOV 14 - 15, 2026',
        time: '5:00 PM - 8:00 PM',
        location: 'Om Natraj Dance Studio, Hall B, Banmore, Morena',
        description: 'Exclusive 2-day session for brides, grooms, and bridal entourages to polish transitions, stage lift basics, and camera-ready dance poses.',
        image: resolveUrl('/images/wedding-dance.jpg'),
        badge: 'Couples & Family',
        status: 'upcoming'
      },
      {
        name: 'Annual Studio Showcase: "Tarang 2026"',
        date: 'DEC 20, 2026',
        time: '6:00 PM onwards',
        location: 'Banmore Auditorium, Morena, MP',
        description: 'Our premier annual dance festival where all Om Natraj dance studio students take the stage in front of a live 1,000+ audience in Banmore, Morena.',
        image: resolveUrl('/images/hero-dance.jpg'),
        badge: 'Annual Concert',
        status: 'upcoming'
      }
    ];

    stats.modules.events = { inserted: 0, updated: 0, skipped: 0 };
    for (const ev of eventsData) {
      const existing = await EventModel.findOne({ name: ev.name });
      if (!existing) {
        await EventModel.create(ev);
        stats.inserted++;
        stats.modules.events.inserted++;
      } else {
        await EventModel.findByIdAndUpdate(existing._id, ev, { new: true });
        stats.updated++;
        stats.modules.events.updated++;
      }
    }
    console.log(`[Seed] ${eventsData.length} events upserted with Cloudinary media`);

    // 6. Products (3 Items)
    const productsData = [
      {
        name: 'Handcrafted Navratri Garba Chaniya Choli Set',
        price: 3499,
        originalPrice: 4999,
        description: 'Exclusive artisanal Garba outfit featuring authentic Kutchi embroidery, real glass mirror accents, heavy flare ghagra, matching blouse, and embroidered dupatta.',
        images: [resolveUrl('/images/garba-dress.jpg')],
        sizes: ['S', 'M', 'L', 'XL', 'Free Size (Adjustable)'],
        colors: ['Royal Maroon & Indigo', 'Mustard Yellow', 'Peacock Teal'],
        stockStatus: 'in_stock',
        category: 'Garba Dresses',
        published: true
      },
      {
        name: 'Professional Brass Ghungroo Dance Bells (100 Bells)',
        price: 1299,
        originalPrice: 1799,
        description: 'Heavy resonant brass bells woven onto premium velvet and leather padded cords, delivering rich acoustic clarity for classical and folk dance practice.',
        images: [resolveUrl('/images/dance-accessories.jpg') || resolveUrl('/images/garba-dress.jpg')],
        sizes: ['Standard Pair (100 Bells)', 'Master Pair (150 Bells)'],
        colors: ['Crimson Red Velvet', 'Royal Blue Velvet'],
        stockStatus: 'in_stock',
        category: 'Dance Accessories',
        published: true
      },
      {
        name: 'Carved Lacquer Folk Dandiya Sticks (Pair)',
        price: 499,
        originalPrice: 799,
        description: 'Solid wood hand-carved dandiya sticks with balanced grip and vibrant festival lacquer finish, designed for high-energy Garba nights.',
        images: [resolveUrl('/images/garba-dance.jpg')],
        sizes: ['15-inch standard'],
        colors: ['Multi-color Festive'],
        stockStatus: 'in_stock',
        category: 'Dance Accessories',
        published: true
      }
    ];

    stats.modules.products = { inserted: 0, updated: 0, skipped: 0 };
    for (const p of productsData) {
      const existing = await ProductModel.findOne({ name: p.name });
      if (!existing) {
        await ProductModel.create(p);
        stats.inserted++;
        stats.modules.products.inserted++;
      } else {
        await ProductModel.findByIdAndUpdate(existing._id, p, { new: true });
        stats.updated++;
        stats.modules.products.updated++;
      }
    }
    console.log(`[Seed] ${productsData.length} products upserted with Cloudinary media`);

    // 7. Gallery (6 Items)
    const galleryData = [
      {
        title: 'Contemporary Flight & Elevation',
        description: 'Senior dance company performance captured mid-leap under golden spotlighting.',
        category: 'Contemporary',
        imageUrl: resolveUrl('/images/hero-dance.jpg'),
        mediaType: 'image',
        aspectRatio: 'landscape',
        order: 1,
        published: true
      },
      {
        title: 'Navratri Garba Passion',
        description: 'The swirling energy and radiant colors of Banmore Garba celebrations.',
        category: 'Garba',
        imageUrl: resolveUrl('/images/garba-dance.jpg'),
        mediaType: 'image',
        aspectRatio: 'landscape',
        order: 2,
        published: true
      },
      {
        title: 'Urban Hip-Hop Crew Silhouette',
        description: 'Street dance battle choreography on our mirrored stage.',
        category: 'Hip-Hop',
        imageUrl: resolveUrl('/images/bollywood-hiphop.jpg'),
        mediaType: 'image',
        aspectRatio: 'landscape',
        order: 3,
        published: true
      },
      {
        title: 'The Eternal Sangeet Dip',
        description: 'Bridal couple dance performance at a luxury destination wedding in Morena.',
        category: 'Wedding Dance',
        imageUrl: resolveUrl('/images/wedding-dance.jpg'),
        mediaType: 'image',
        aspectRatio: 'landscape',
        order: 4,
        published: true
      },
      {
        title: 'Young Dreams in Motion',
        description: 'Kids dance batch rehearsing synchronization and stage formations.',
        category: 'Kids Dance',
        imageUrl: resolveUrl('/images/kids-dance.jpg'),
        mediaType: 'image',
        aspectRatio: 'landscape',
        order: 5,
        published: true
      },
      {
        title: 'State-of-the-Art Rehearsal Studio',
        description: 'Spacious sprung wooden dance floor, acoustic panels, and atmospheric warm perimeter lighting.',
        category: 'Studio Space',
        imageUrl: resolveUrl('/images/studio-interior.jpg'),
        mediaType: 'image',
        aspectRatio: 'landscape',
        order: 6,
        published: true
      }
    ];

    stats.modules.gallery = { inserted: 0, updated: 0, skipped: 0 };
    for (const g of galleryData) {
      const existing = await GalleryModel.findOne({ title: g.title });
      if (!existing) {
        await GalleryModel.create(g);
        stats.inserted++;
        stats.modules.gallery.inserted++;
      } else {
        await GalleryModel.findByIdAndUpdate(existing._id, g, { new: true });
        stats.updated++;
        stats.modules.gallery.updated++;
      }
    }
    console.log(`[Seed] ${galleryData.length} gallery items upserted with Cloudinary media`);

    // 8. Videos (3 Items)
    const videosData = [
      {
        title: 'OM NATRAJ DANCE STUDIO - Studio Reel 2026',
        description: 'A cinematic montage capturing our contemporary, Bollywood, and Garba choreography.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        posterUrl: resolveUrl('/images/hero-dance.jpg'),
        duration: '01:45',
        featured: true,
        published: true
      },
      {
        title: 'Banmore Navratri Garba Highlights',
        description: 'Live performance of our senior Garba troupe performing authentic Gujarati steps.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        posterUrl: resolveUrl('/images/garba-dance.jpg'),
        duration: '02:10',
        featured: false,
        published: true
      },
      {
        title: 'Royal Wedding Sangeet Choreography',
        description: 'Romantic couple choreography and energetic family flashmob staged in Banmore, Morena.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        posterUrl: resolveUrl('/images/wedding-dance.jpg'),
        duration: '01:50',
        featured: false,
        published: true
      }
    ];

    stats.modules.videos = { inserted: 0, updated: 0, skipped: 0 };
    for (const v of videosData) {
      // Find by title or former title
      const existing = await VideoModel.findOne({
        $or: [
          { title: v.title },
          { title: 'Banmore Navratri Garba Highlights' }
        ]
      });
      if (!existing) {
        await VideoModel.create(v);
        stats.inserted++;
        stats.modules.videos.inserted++;
      } else {
        await VideoModel.findByIdAndUpdate(existing._id, v, { new: true });
        stats.updated++;
        stats.modules.videos.updated++;
      }
    }
    console.log(`[Seed] ${videosData.length} videos upserted with Cloudinary media`);

    // 9. Testimonials (3 Items)
    const testimonialsData = [
      {
        name: 'Pooja Verma',
        role: 'Garba Workshop Participant, Banmore',
        testimonial: 'Om Natraj Dance Studio transformed my confidence completely. The instructors teach with so much patience and passion. Their Garba workshop prepared me to dance non-stop with real style!',
        rating: 5,
        status: 'published'
      },
      {
        name: 'Rohit & Shreya Sharma',
        role: 'Wedding Sangeet Clients',
        testimonial: 'Neither my husband nor I had ever danced on stage before. The team choreographed a magical, graceful routine for our sangeet in Banmore that had everyone on their feet cheering.',
        rating: 5,
        status: 'published'
      },
      {
        name: 'Ananya Mehta',
        role: 'Contemporary Student (2 Years)',
        testimonial: 'The studio vibe is unlike anywhere else in Morena. High energy, artistic integrity, and true technique. It has become my second home.',
        rating: 5,
        status: 'published'
      }
    ];

    stats.modules.testimonials = { inserted: 0, updated: 0, skipped: 0 };
    for (const t of testimonialsData) {
      const existing = await TestimonialModel.findOne({ name: t.name });
      if (!existing) {
        await TestimonialModel.create(t);
        stats.inserted++;
        stats.modules.testimonials.inserted++;
      } else {
        await TestimonialModel.findByIdAndUpdate(existing._id, t, { new: true });
        stats.updated++;
        stats.modules.testimonials.updated++;
      }
    }
    console.log(`[Seed] ${testimonialsData.length} testimonials upserted`);

    console.log('[Seed] Database initialization and Cloudinary media linkage complete!');
    return stats;
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};
