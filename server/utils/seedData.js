import bcrypt from 'bcryptjs';
import { StorageService } from '../services/storageService.js';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Checking existing data...');

    // 1. Admin User
    const existingAdmin = await StorageService.findOne('admin', { username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('omnatrajadmin', 10);
      await StorageService.create('admin', {
        username: 'admin',
        email: 'kushanikt667@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('[Seed] Admin account created (username: admin, pass: omnatrajadmin)');
    }

    // 2. Settings
    const existingSettings = await StorageService.find('settings');
    if (existingSettings.length === 0) {
      await StorageService.create('settings', {
        studioName: 'OM NATRAJ DANCE STUDIO',
        tagline: 'Where Movement Becomes Expression.',
        secondaryText: 'Learn. Move. Perform. Create.',
        phone: '+91 9713799075',
        whatsappNumber: '919713799075',
        email: 'kushanikt667@gmail.com',
        address: 'Indore, Madhya Pradesh, India',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
        youtubeUrl: 'https://www.youtube.com/@OMNDS',
        instagramUrl: 'https://instagram.com/omnatrajdancestudio',
        facebookUrl: '',
        introHeading: "Dance is not just about learning steps.\nIt's about finding your own rhythm.",
        introSubtext: 'Rooted in the timeless grace of Indian rhythm and propelled by cutting-edge contemporary choreography. We mold aspiring dancers into stage-ready performers right here in Indore.',
        statistics: [
          { id: 'experience', label: 'Years of Experience', value: 12, prefix: '', suffix: '+', description: 'Nurturing dance excellence in Indore' },
          { id: 'students', label: 'Students Trained', value: 2500, prefix: '', suffix: '+', description: 'Across kids, youth & adult batches' },
          { id: 'styles', label: 'Dance Styles', value: 8, prefix: '', suffix: '+', description: 'Bollywood, Garba, Hip-Hop, Contemporary & more' },
          { id: 'events', label: 'Events & Workshops', value: 150, prefix: '', suffix: '+', description: 'Annual concerts, sangeet & cultural fests' }
        ],
        footerText: 'A premier dance academy fostering rhythm, confidence, and artistic performance in Indore, Madhya Pradesh.'
      });
      console.log('[Seed] Settings initialized');
    }

    // 3. Classes
    const existingClasses = await StorageService.find('classes');
    if (existingClasses.length === 0) {
      const classesData = [
        {
          name: 'Bollywood Commercial & Stage Dance',
          danceStyle: 'Bollywood',
          description: 'High-energy choreography blending expressive Indian cinematic expressions with sharp modern stage footwork and camera performance technique.',
          ageGroup: 'Teens & Adults (13+)',
          level: 'Beginner to Advanced',
          schedule: 'Mon, Wed, Fri | 6:00 PM - 7:30 PM',
          instructor: 'Senior Choreographer',
          image: '/images/bollywood-hiphop.jpg',
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
          image: '/images/garba-dance.jpg',
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
          image: '/images/hero-dance.jpg',
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
          image: '/images/bollywood-hiphop.jpg',
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
          image: '/images/kids-dance.jpg',
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
          image: '/images/wedding-dance.jpg',
          status: 'active'
        }
      ];

      for (const c of classesData) {
        await StorageService.create('classes', c);
      }
      console.log(`[Seed] ${classesData.length} classes seeded`);
    }

    // 4. Events / Workshops
    const existingEvents = await StorageService.find('events');
    if (existingEvents.length === 0) {
      const eventsData = [
        {
          name: 'Grand Navratri Garba Intensive Bootcamp',
          date: 'OCT 24 - 28, 2026',
          time: '6:30 PM - 9:00 PM',
          location: 'Om Natraj Dance Studio, Main Arena, Indore',
          description: 'An electrifying 5-day workshop covering authentic Mandvi steps, rapid spinning endurance, and group formations before the festival season kicks off.',
          image: '/images/garba-dance.jpg',
          badge: 'Signature Workshop',
          status: 'upcoming'
        },
        {
          name: 'Sangeet & Wedding Dance Masterclass',
          date: 'NOV 14 - 15, 2026',
          time: '5:00 PM - 8:00 PM',
          location: 'Om Natraj Dance Studio, Hall B, Indore',
          description: 'Exclusive 2-day session for brides, grooms, and bridal entourages to polish transitions, stage lift basics, and camera-ready dance poses.',
          image: '/images/wedding-dance.jpg',
          badge: 'Couples & Family',
          status: 'upcoming'
        },
        {
          name: 'Annual Studio Showcase: "Tarang 2026"',
          date: 'DEC 20, 2026',
          time: '6:00 PM onwards',
          location: 'Ravindra Natya Grah, Indore, MP',
          description: 'Our premier annual dance festival where all Om Natraj academy students take the stage in front of a live 1,000+ audience in Indore.',
          image: '/images/hero-dance.jpg',
          badge: 'Annual Concert',
          status: 'upcoming'
        }
      ];

      for (const ev of eventsData) {
        await StorageService.create('events', ev);
      }
      console.log(`[Seed] ${eventsData.length} events seeded`);
    }

    // 5. Products
    const existingProducts = await StorageService.find('products');
    if (existingProducts.length === 0) {
      const productsData = [
        {
          name: 'Handcrafted Navratri Garba Chaniya Choli Set',
          price: 3499,
          originalPrice: 4999,
          description: 'Exclusive artisanal Garba outfit featuring authentic Kutchi embroidery, real glass mirror accents, heavy flare ghagra, matching blouse, and embroidered dupatta.',
          images: ['/images/garba-dress.jpg'],
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
          images: ['/images/garba-dress.jpg'],
          sizes: ['Standard (Pair)'],
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
          images: ['/images/garba-dance.jpg'],
          sizes: ['15-inch standard'],
          colors: ['Multi-color Festive'],
          stockStatus: 'in_stock',
          category: 'Dance Accessories',
          published: true
        }
      ];

      for (const p of productsData) {
        await StorageService.create('products', p);
      }
      console.log(`[Seed] ${productsData.length} products seeded`);
    }

    // 6. Gallery
    const existingGallery = await StorageService.find('gallery');
    if (existingGallery.length === 0) {
      const galleryData = [
        {
          title: 'Contemporary Flight & Elevation',
          description: 'Senior dance company performance captured mid-leap under golden spotlighting.',
          category: 'Contemporary',
          imageUrl: '/images/hero-dance.jpg',
          mediaType: 'image',
          aspectRatio: 'landscape',
          published: true
        },
        {
          title: 'Navratri Garba Passion',
          description: 'The swirling energy and radiant colors of Indore Garba celebrations.',
          category: 'Garba',
          imageUrl: '/images/garba-dance.jpg',
          mediaType: 'image',
          aspectRatio: 'landscape',
          published: true
        },
        {
          title: 'Urban Hip-Hop Crew Silhouette',
          description: 'Street dance battle choreography on our mirrored stage.',
          category: 'Hip-Hop',
          imageUrl: '/images/bollywood-hiphop.jpg',
          mediaType: 'image',
          aspectRatio: 'landscape',
          published: true
        },
        {
          title: 'The Eternal Sangeet Dip',
          description: 'Bridal couple dance performance at a luxury destination wedding in Indore.',
          category: 'Wedding Dance',
          imageUrl: '/images/wedding-dance.jpg',
          mediaType: 'image',
          aspectRatio: 'landscape',
          published: true
        },
        {
          title: 'Young Dreams in Motion',
          description: 'Kids dance batch rehearsing synchronization and stage formations.',
          category: 'Kids Dance',
          imageUrl: '/images/kids-dance.jpg',
          mediaType: 'image',
          aspectRatio: 'landscape',
          published: true
        },
        {
          title: 'State-of-the-Art Rehearsal Studio',
          description: 'Spacious sprung wooden dance floor, acoustic panels, and atmospheric warm perimeter lighting.',
          category: 'Studio Space',
          imageUrl: '/images/studio-interior.jpg',
          mediaType: 'image',
          aspectRatio: 'landscape',
          published: true
        }
      ];

      for (const g of galleryData) {
        await StorageService.create('gallery', g);
      }
      console.log(`[Seed] ${galleryData.length} gallery items seeded`);
    }

    // 7. Videos
    const existingVideos = await StorageService.find('videos');
    if (existingVideos.length === 0) {
      const videosData = [
        {
          title: 'OM NATRAJ DANCE STUDIO - Studio Reel 2026',
          description: 'A cinematic montage capturing our contemporary, Bollywood, and Garba choreography.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
          posterUrl: '/images/hero-dance.jpg',
          duration: '01:45',
          featured: true,
          published: true
        },
        {
          title: 'Indore Navratri Garba Highlights',
          description: 'Live performance of our senior Garba troupe performing authentic Gujarati steps.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: '/images/garba-dance.jpg',
          duration: '02:10',
          featured: false,
          published: true
        },
        {
          title: 'Royal Wedding Sangeet Choreography',
          description: 'Romantic couple choreography and energetic family flashmob staged in Indore.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          posterUrl: '/images/wedding-dance.jpg',
          duration: '01:50',
          featured: false,
          published: true
        }
      ];

      for (const v of videosData) {
        await StorageService.create('videos', v);
      }
      console.log(`[Seed] ${videosData.length} videos seeded`);
    }

    // 8. Testimonials
    const existingTestimonials = await StorageService.find('testimonials');
    if (existingTestimonials.length === 0) {
      const testimonialsData = [
        {
          name: 'Pooja Verma',
          role: 'Garba Workshop Participant, Indore',
          testimonial: 'Om Natraj Dance Studio transformed my confidence completely. The instructors teach with so much patience and passion. Their Garba workshop prepared me to dance non-stop with real style!',
          rating: 5,
          status: 'published'
        },
        {
          name: 'Rohit & Shreya Sharma',
          role: 'Wedding Sangeet Clients',
          testimonial: 'Neither my husband nor I had ever danced on stage before. The team choreographed a magical, graceful routine for our sangeet in Indore that had everyone on their feet cheering.',
          rating: 5,
          status: 'published'
        },
        {
          name: 'Ananya Mehta',
          role: 'Contemporary Student (2 Years)',
          testimonial: 'The studio vibe is unlike anywhere else in Indore. High energy, artistic integrity, and true technique. It has become my second home.',
          rating: 5,
          status: 'published'
        }
      ];

      for (const t of testimonialsData) {
        await StorageService.create('testimonials', t);
      }
      console.log(`[Seed] ${testimonialsData.length} testimonials seeded`);
    }

    console.log('[Seed] Database initialization complete!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};
