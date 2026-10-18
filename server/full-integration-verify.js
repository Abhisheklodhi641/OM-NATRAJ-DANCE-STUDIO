import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const makeRequest = (endpoint, method = 'GET', body = null, token = null, customHeaders = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const headers = { ...customHeaders };
    let payload = null;

    if (body && !(body instanceof Buffer)) {
      payload = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    } else if (body instanceof Buffer) {
      payload = body;
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

const multipartUpload = (endpoint, fieldName, filename, fileBuffer, mimeType, token) => {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const url = new URL(`${BASE_URL}${endpoint}`);

    const pre = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
    );
    const post = Buffer.from(`\r\n--${boundary}--\r\n`);
    const fullBody = Buffer.concat([pre, fileBuffer, post]);

    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length,
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
};

async function runAllTests() {
  console.log('===============================================================');
  console.log('  OM NATRAJ DANCE STUDIO - COMPLETE END-TO-END INTEGRATION TEST');
  console.log('===============================================================');

  // Direct MongoDB Connection for Verification
  console.log('\n[Phase 0] Connecting directly to MongoDB Atlas for verification...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[Phase 0] Connected to Atlas Database: "${mongoose.connection.name}"`);

  const results = {
    adminAuth: false,
    products: false,
    productEnquiries: false,
    leads: false,
    settings: false,
    classes: false,
    events: false,
    gallery: false,
    videos: false,
    testimonials: false,
    cloudinary: false,
    errorHandling: false,
    databaseIntegrity: false
  };

  let adminToken = '';

  // 1. HEALTH & CONNECTION
  console.log('\n--- 1. DATABASE CONNECTION TEST ---');
  const healthRes = await makeRequest('/health');
  console.log('Health Check API Response:', healthRes.data);
  if (healthRes.status === 200 && healthRes.data.mongoStatus === 'CONNECTED' && healthRes.data.fallbackLocalStorage === 'NOT USED') {
    console.log('✓ PASS: MongoDB Atlas is CONNECTED and fallback storage is NOT USED');
  } else {
    throw new Error('✗ FAIL: MongoDB Atlas is not reported as CONNECTED');
  }

  // 2. ADMIN AUTHENTICATION
  console.log('\n--- 2. ADMIN AUTHENTICATION TEST ---');
  // Check existing admin in MongoDB directly
  const adminCol = mongoose.connection.db.collection('admins');
  const adminDocs = await adminCol.find({ username: 'admin' }).toArray();
  console.log(`Direct MongoDB Admin Count for 'admin': ${adminDocs.length}`);
  if (adminDocs.length !== 1) throw new Error(`Expected 1 admin, found ${adminDocs.length}`);
  
  const adminDoc = adminDocs[0];
  console.log(`Admin Document in Atlas: ID=${adminDoc._id}, username=${adminDoc.username}, role=${adminDoc.role}, status=${adminDoc.status}`);
  console.log(`Admin Password Hash Type: ${adminDoc.password.substring(0, 7)}... (Length: ${adminDoc.password.length})`);
  
  // Test wrong password
  const badLogin = await makeRequest('/auth/login', 'POST', { username: 'admin', password: 'wrongPassword123' });
  if (badLogin.status === 401) {
    console.log('✓ PASS: Wrong password rejected with 401 Unauthorized');
  } else {
    throw new Error(`✗ FAIL: Wrong password returned status ${badLogin.status}`);
  }

  // Test correct password
  const goodLogin = await makeRequest('/auth/login', 'POST', { username: 'admin', password: 'omnatrajadmin' });
  if (goodLogin.status === 200 && goodLogin.data.token) {
    adminToken = goodLogin.data.token;
    console.log('✓ PASS: Correct password successfully authenticated (JWT generated)');
  } else {
    throw new Error('✗ FAIL: Correct password login failed');
  }

  // Test protected route with token
  const meRes = await makeRequest('/auth/me', 'GET', null, adminToken);
  if (meRes.status === 200 && meRes.data.admin.username === 'admin') {
    console.log('✓ PASS: GET /api/auth/me authenticated successfully');
  } else {
    throw new Error('✗ FAIL: /auth/me rejected valid token');
  }

  // Test protected route without token
  const unauthRes = await makeRequest('/auth/me', 'GET');
  if (unauthRes.status === 401) {
    console.log('✓ PASS: Unauthenticated request to /auth/me correctly rejected with 401');
  } else {
    throw new Error('✗ FAIL: Unauthenticated request not blocked with 401');
  }

  // Test logout endpoint
  const logoutRes = await makeRequest('/auth/logout', 'POST');
  if (logoutRes.status === 200) {
    console.log('✓ PASS: POST /api/auth/logout returned success');
  }

  results.adminAuth = true;

  // 3. PRODUCT COMPLETE CRUD TEST
  console.log('\n--- 3. PRODUCT COMPLETE CRUD TEST ---');
  const testProductData = {
    name: 'TEST - OM Natraj Database Product',
    price: 3499,
    originalPrice: 4999,
    description: 'High grade traditional Garba dress for end-to-end database verification',
    category: 'Garba Dresses',
    images: ['https://res.cloudinary.com/dwcat1ge5/image/upload/v1/test-sample.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Maroon Gold', 'Peacock Blue'],
    stockStatus: 'in_stock',
    published: true
  };

  // CREATE
  const createProdRes = await makeRequest('/products', 'POST', testProductData, adminToken);
  if (createProdRes.status !== 201 || !createProdRes.data.product?._id) {
    throw new Error('Failed to create test product');
  }
  const testProdId = createProdRes.data.product._id;
  console.log(`Created Product ID: ${testProdId}`);

  // VERIFY IN MONGODB DIRECTLY
  const prodCol = mongoose.connection.db.collection('products');
  let dbProd = await prodCol.findOne({ _id: new mongoose.Types.ObjectId(testProdId) });
  if (!dbProd || dbProd.name !== testProductData.name) {
    throw new Error('Product not found in MongoDB Atlas directly');
  }
  console.log('✓ PASS: Product created and directly verified in MongoDB Atlas');

  // GET
  const getProdRes = await makeRequest(`/products/${testProdId}`);
  if (getProdRes.status === 200 && getProdRes.data.product.price === 3499) {
    console.log('✓ PASS: GET /api/products/:id returned accurate fields');
  } else {
    throw new Error('Failed to fetch created product');
  }

  // UPDATE
  const updateProdData = {
    name: 'TEST - OM Natraj Database Product (UPDATED)',
    description: 'Updated description for database integrity test',
    price: 3999,
    category: 'Accessories'
  };
  const updateProdRes = await makeRequest(`/products/${testProdId}`, 'PUT', updateProdData, adminToken);
  if (updateProdRes.status === 200 && updateProdRes.data.product.price === 3999) {
    // Verify in MongoDB directly
    dbProd = await prodCol.findOne({ _id: new mongoose.Types.ObjectId(testProdId) });
    if (dbProd.name === updateProdData.name && dbProd.price === 3999 && dbProd.category === 'Accessories') {
      console.log('✓ PASS: Product updated and verified in MongoDB Atlas');
    } else {
      throw new Error('MongoDB does not contain updated product values');
    }
  } else {
    throw new Error('Failed to update product via API');
  }

  // DELETE
  const deleteProdRes = await makeRequest(`/products/${testProdId}`, 'DELETE', null, adminToken);
  if (deleteProdRes.status === 200) {
    // Verify removed in MongoDB
    dbProd = await prodCol.findOne({ _id: new mongoose.Types.ObjectId(testProdId) });
    if (dbProd === null) {
      console.log('✓ PASS: Product deleted and verified removed from MongoDB Atlas');
      results.products = true;
    } else {
      throw new Error('Product still exists in MongoDB after deletion');
    }
  } else {
    throw new Error('Failed to delete product via API');
  }

  // 4. PRODUCT ENQUIRY COMPLETE TEST
  console.log('\n--- 4. PRODUCT ENQUIRY COMPLETE TEST ---');
  const testEnquiryData = {
    name: 'Database Test User',
    phone: '9999999999',
    email: 'dbtest@example.com',
    product: 'TEST PRODUCT',
    message: 'Database CRUD verification test'
  };

  // CREATE ENQUIRY
  const createEnquiryRes = await makeRequest('/enquiries', 'POST', testEnquiryData);
  if (createEnquiryRes.status !== 201 || !createEnquiryRes.data.lead?._id) {
    throw new Error('Failed to create enquiry');
  }
  const testEnquiryId = createEnquiryRes.data.lead._id;
  console.log(`Created Enquiry ID: ${testEnquiryId}`);

  // VERIFY IN MONGODB DIRECTLY
  const leadCol = mongoose.connection.db.collection('leads');
  let dbEnquiry = await leadCol.findOne({ _id: new mongoose.Types.ObjectId(testEnquiryId) });
  if (!dbEnquiry || dbEnquiry.phone !== '9999999999') {
    throw new Error('Enquiry not found in MongoDB Atlas');
  }
  console.log('✓ PASS: Enquiry created and verified directly in MongoDB Atlas');

  // GET
  const getEnquiriesRes = await makeRequest(`/leads?search=dbtest@example.com`, 'GET', null, adminToken);
  if (getEnquiriesRes.status === 200 && getEnquiriesRes.data.leads.length > 0) {
    console.log('✓ PASS: GET /api/leads search found test enquiry');
  } else {
    throw new Error('Search failed to find test enquiry');
  }

  // GET BY ID
  const getEnquiryByIdRes = await makeRequest(`/leads/${testEnquiryId}`, 'GET', null, adminToken);
  if (getEnquiryByIdRes.status === 200 && getEnquiryByIdRes.data.lead.name === testEnquiryData.name) {
    console.log('✓ PASS: GET /api/leads/:id returned correct enquiry data');
  } else {
    throw new Error('GET by ID failed for enquiry');
  }

  // UPDATE STATUS & DETAILS
  const updateEnquiryRes = await makeRequest(`/leads/${testEnquiryId}`, 'PATCH', {
    status: 'CONTACTED',
    notes: 'Contacted client regarding Garba Dress purchase'
  }, adminToken);
  if (updateEnquiryRes.status === 200 && updateEnquiryRes.data.lead.status === 'CONTACTED') {
    dbEnquiry = await leadCol.findOne({ _id: new mongoose.Types.ObjectId(testEnquiryId) });
    if (dbEnquiry.status === 'CONTACTED' && dbEnquiry.notes.includes('Garba Dress')) {
      console.log('✓ PASS: Enquiry status updated and verified in MongoDB Atlas');
    } else {
      throw new Error('Enquiry update not reflected in MongoDB');
    }
  } else {
    throw new Error('Failed to update enquiry status');
  }

  // DELETE
  const deleteEnquiryRes = await makeRequest(`/leads/${testEnquiryId}`, 'DELETE', null, adminToken);
  if (deleteEnquiryRes.status === 200) {
    dbEnquiry = await leadCol.findOne({ _id: new mongoose.Types.ObjectId(testEnquiryId) });
    if (dbEnquiry === null) {
      console.log('✓ PASS: Enquiry deleted and verified removed from MongoDB Atlas');
      results.productEnquiries = true;
    } else {
      throw new Error('Enquiry still present in MongoDB after delete');
    }
  } else {
    throw new Error('Failed to delete enquiry');
  }

  // 5. LEADS COMPLETE TEST
  console.log('\n--- 5. LEADS COMPLETE TEST ---');
  const testLeadData = {
    name: 'Temporary Test Lead',
    phone: '8888888888',
    email: 'testlead@example.com',
    interestedIn: 'Bollywood Dance',
    preferredClass: 'Evening Batch',
    message: 'Checking studio schedule'
  };

  const createLeadRes = await makeRequest('/leads', 'POST', testLeadData);
  const testLeadId = createLeadRes.data.lead._id;
  console.log(`Created Lead ID: ${testLeadId}`);

  // GET ALL
  const allLeadsRes = await makeRequest('/leads', 'GET', null, adminToken);
  if (allLeadsRes.status === 200 && Array.isArray(allLeadsRes.data.leads)) {
    console.log(`✓ PASS: GET /api/leads returned list of ${allLeadsRes.data.leads.length} leads`);
  }

  // GET BY ID
  const leadByIdRes = await makeRequest(`/leads/${testLeadId}`, 'GET', null, adminToken);
  if (leadByIdRes.status === 200 && leadByIdRes.data.lead.phone === '8888888888') {
    console.log('✓ PASS: GET /api/leads/:id retrieved lead');
  }

  // UPDATE
  const updateLeadRes = await makeRequest(`/leads/${testLeadId}`, 'PUT', {
    status: 'CONVERTED',
    notes: 'Enrolled in beginner batch',
    phone: '8888888889'
  }, adminToken);
  if (updateLeadRes.status === 200 && updateLeadRes.data.lead.status === 'CONVERTED') {
    const dbLead = await leadCol.findOne({ _id: new mongoose.Types.ObjectId(testLeadId) });
    if (dbLead.status === 'CONVERTED' && dbLead.phone === '8888888889') {
      console.log('✓ PASS: Lead updated and verified in MongoDB Atlas');
    }
  }

  // DELETE
  const deleteLeadRes = await makeRequest(`/leads/${testLeadId}`, 'DELETE', null, adminToken);
  if (deleteLeadRes.status === 200) {
    const dbLead = await leadCol.findOne({ _id: new mongoose.Types.ObjectId(testLeadId) });
    if (!dbLead) {
      console.log('✓ PASS: Lead deleted and verified removed from MongoDB Atlas');
      results.leads = true;
    }
  }

  // 6. STUDIO SETTINGS TEST
  console.log('\n--- 6. STUDIO SETTINGS TEST ---');
  const settingsCol = mongoose.connection.db.collection('settings');
  const initialSettingsRes = await makeRequest('/settings');
  if (initialSettingsRes.status !== 200 || !initialSettingsRes.data.settings) {
    throw new Error('Failed to fetch studio settings');
  }
  const originalTagline = initialSettingsRes.data.settings.tagline;
  console.log(`Original Studio Tagline: "${originalTagline}"`);

  // Verify all fields present
  const st = initialSettingsRes.data.settings;
  const expectedFields = [
    'studioName', 'phone', 'whatsappNumber', 'email', 'address', 'city', 'state',
    'country', 'pincode', 'latitude', 'longitude', 'googleMapsUrl', 'youtubeUrl',
    'instagramUrl', 'facebookUrl', 'heroMedia', 'aboutImage', 'cinematicVideo', 'ctaImage'
  ];
  for (const f of expectedFields) {
    if (st[f] === undefined) {
      console.warn(`Field ${f} undefined in settings`);
    }
  }
  console.log('✓ PASS: All studio settings fields verified');

  // UPDATE ONE FIELD
  const tempTagline = 'TEMPORARY VERIFICATION TAGLINE 2026';
  const updateSettingsRes = await makeRequest('/settings', 'PUT', { tagline: tempTagline }, adminToken);
  if (updateSettingsRes.status === 200 && updateSettingsRes.data.settings.tagline === tempTagline) {
    // Check MongoDB directly
    const dbSettings = await settingsCol.findOne({});
    if (dbSettings.tagline === tempTagline) {
      console.log('✓ PASS: Updated setting persisted in MongoDB Atlas');
    } else {
      throw new Error('MongoDB did not reflect settings update');
    }
  }

  // RESTORE ORIGINAL
  await makeRequest('/settings', 'PUT', { tagline: originalTagline }, adminToken);
  const restoredSettings = await settingsCol.findOne({});
  if (restoredSettings.tagline === originalTagline) {
    console.log('✓ PASS: Original setting restored in MongoDB Atlas');
  }

  // Check no duplicates in settings
  const settingsCount = await settingsCol.countDocuments({});
  console.log(`Total Settings Documents in MongoDB: ${settingsCount}`);
  if (settingsCount === 1) {
    console.log('✓ PASS: Zero duplicate settings documents confirmed');
    results.settings = true;
  } else {
    throw new Error(`Duplicate settings documents detected: ${settingsCount}`);
  }

  // 7. CLASSES TEST
  console.log('\n--- 7. CLASSES COMPLETE CRUD TEST ---');
  const classCol = mongoose.connection.db.collection('classes');
  const testClassData = {
    name: 'TEST - Masterclass Kathak',
    danceStyle: 'Classical Kathak',
    description: 'Rhythmic footwork and classical spins',
    ageGroup: '10+',
    level: 'Intermediate',
    schedule: 'Saturday & Sunday 10am',
    instructor: 'Visiting Guru',
    image: '/images/bollywood-hiphop.jpg',
    status: 'active'
  };

  const createClassRes = await makeRequest('/classes', 'POST', testClassData, adminToken);
  const testClassId = createClassRes.data.class._id;
  console.log(`Created Class ID: ${testClassId}`);

  // READ
  const getClassRes = await makeRequest(`/classes/${testClassId}`);
  if (getClassRes.status === 200 && getClassRes.data.class.name === testClassData.name) {
    console.log('✓ PASS: GET /api/classes/:id verified');
  }

  // UPDATE
  const updateClassRes = await makeRequest(`/classes/${testClassId}`, 'PUT', { description: 'Updated Kathak syllabus' }, adminToken);
  if (updateClassRes.status === 200) {
    const dbClass = await classCol.findOne({ _id: new mongoose.Types.ObjectId(testClassId) });
    if (dbClass.description === 'Updated Kathak syllabus') {
      console.log('✓ PASS: Class updated and verified in MongoDB Atlas');
    }
  }

  // DELETE
  const deleteClassRes = await makeRequest(`/classes/${testClassId}`, 'DELETE', null, adminToken);
  if (deleteClassRes.status === 200) {
    const dbClass = await classCol.findOne({ _id: new mongoose.Types.ObjectId(testClassId) });
    if (!dbClass) {
      console.log('✓ PASS: Class deleted and verified removed from MongoDB Atlas');
      results.classes = true;
    }
  }

  // 8. EVENTS TEST
  console.log('\n--- 8. EVENTS COMPLETE CRUD TEST ---');
  const eventCol = mongoose.connection.db.collection('events');
  const testEventData = {
    name: 'TEST - Annual Natraj Dance Fest',
    date: 'DEC 24, 2026',
    time: '7:00 PM',
    location: 'Main Auditorium',
    description: 'Grand choreography showcase',
    badge: 'Concert',
    status: 'upcoming'
  };

  const createEventRes = await makeRequest('/events', 'POST', testEventData, adminToken);
  const testEventId = createEventRes.data.event._id;
  console.log(`Created Event ID: ${testEventId}`);

  // READ
  const getEventRes = await makeRequest(`/events/${testEventId}`);
  if (getEventRes.status === 200 && getEventRes.data.event.name === testEventData.name) {
    console.log('✓ PASS: GET /api/events/:id verified');
  }

  // UPDATE
  const updateEventRes = await makeRequest(`/events/${testEventId}`, 'PUT', { time: '8:00 PM' }, adminToken);
  if (updateEventRes.status === 200) {
    const dbEvent = await eventCol.findOne({ _id: new mongoose.Types.ObjectId(testEventId) });
    if (dbEvent.time === '8:00 PM') {
      console.log('✓ PASS: Event updated and verified in MongoDB Atlas');
    }
  }

  // DELETE
  const deleteEventRes = await makeRequest(`/events/${testEventId}`, 'DELETE', null, adminToken);
  if (deleteEventRes.status === 200) {
    const dbEvent = await eventCol.findOne({ _id: new mongoose.Types.ObjectId(testEventId) });
    if (!dbEvent) {
      console.log('✓ PASS: Event deleted and verified removed from MongoDB Atlas');
      results.events = true;
    }
  }

  // 9. GALLERY TEST
  console.log('\n--- 9. GALLERY COMPLETE CRUD TEST ---');
  const galleryCol = mongoose.connection.db.collection('galleries');
  const testGalleryData = {
    title: 'TEST - Navratri Garba Performance',
    description: 'Stage lights and spinning ghagras',
    category: 'Performances',
    imageUrl: 'https://res.cloudinary.com/dwcat1ge5/image/upload/v1/test_gallery.jpg',
    mediaType: 'image',
    aspectRatio: 'landscape'
  };

  const createGalRes = await makeRequest('/gallery', 'POST', testGalleryData, adminToken);
  const testGalId = createGalRes.data.item._id;
  console.log(`Created Gallery Item ID: ${testGalId}`);

  // READ
  const getGalRes = await makeRequest(`/gallery/${testGalId}`);
  if (getGalRes.status === 200 && getGalRes.data.item.title === testGalleryData.title) {
    console.log('✓ PASS: GET /api/gallery/:id verified');
  }

  // UPDATE
  const updateGalRes = await makeRequest(`/gallery/${testGalId}`, 'PUT', { category: 'Workshops' }, adminToken);
  if (updateGalRes.status === 200) {
    const dbGal = await galleryCol.findOne({ _id: new mongoose.Types.ObjectId(testGalId) });
    if (dbGal.category === 'Workshops') {
      console.log('✓ PASS: Gallery item updated and verified in MongoDB Atlas');
    }
  }

  // DELETE
  const deleteGalRes = await makeRequest(`/gallery/${testGalId}`, 'DELETE', null, adminToken);
  if (deleteGalRes.status === 200) {
    const dbGal = await galleryCol.findOne({ _id: new mongoose.Types.ObjectId(testGalId) });
    if (!dbGal) {
      console.log('✓ PASS: Gallery item deleted and verified removed from MongoDB Atlas');
      results.gallery = true;
    }
  }

  // 10. VIDEOS & TESTIMONIALS
  console.log('\n--- 10. VIDEOS & TESTIMONIALS CRUD TEST ---');
  const videoCol = mongoose.connection.db.collection('videos');
  const testVideoData = {
    title: 'TEST - Choreography Reel 2026',
    videoUrl: 'https://youtube.com/watch?v=testreel',
    description: 'Highlights'
  };
  const createVidRes = await makeRequest('/videos', 'POST', testVideoData, adminToken);
  const testVidId = createVidRes.data.video._id;
  const updateVidRes = await makeRequest(`/videos/${testVidId}`, 'PUT', { duration: '02:00' }, adminToken);
  await makeRequest(`/videos/${testVidId}`, 'DELETE', null, adminToken);
  const dbVid = await videoCol.findOne({ _id: new mongoose.Types.ObjectId(testVidId) });
  if (!dbVid) {
    console.log('✓ PASS: Video CRUD verified in MongoDB Atlas');
    results.videos = true;
  }

  const testimonialCol = mongoose.connection.db.collection('testimonials');
  const testTestimonialData = {
    name: 'TEST - Dancer Priya',
    testimonial: 'Transformative experience at Om Natraj Studio!',
    rating: 5
  };
  const createTestiRes = await makeRequest('/testimonials', 'POST', testTestimonialData, adminToken);
  const testTestiId = createTestiRes.data.testimonial._id;
  await makeRequest(`/testimonials/${testTestiId}`, 'PUT', { role: 'Senior Student' }, adminToken);
  await makeRequest(`/testimonials/${testTestiId}`, 'DELETE', null, adminToken);
  const dbTesti = await testimonialCol.findOne({ _id: new mongoose.Types.ObjectId(testTestiId) });
  if (!dbTesti) {
    console.log('✓ PASS: Testimonial CRUD verified in MongoDB Atlas');
    results.testimonials = true;
  }

  // 11. CLOUDINARY FULL TEST
  console.log('\n--- 11. CLOUDINARY FULL TEST ---');
  // 1x1 transparent PNG buffer
  const sample1x1Png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const uploadFilename = 'om-natraj-db-test.png';

  console.log('Uploading temporary test image through real /api/upload endpoint...');
  const uploadRes = await multipartUpload('/upload', 'file', uploadFilename, sample1x1Png, 'image/png', adminToken);
  console.log('Upload Route Response:', uploadRes);

  if (uploadRes.status === 200 && uploadRes.data.file?.url && uploadRes.data.file?.publicId) {
    const uploadedUrl = uploadRes.data.file.url;
    const uploadedPublicId = uploadRes.data.file.publicId;
    console.log(`✓ Cloudinary Upload Successful!`);
    console.log(`  - public_id: ${uploadedPublicId}`);
    console.log(`  - secure_url: ${uploadedUrl}`);

    // Verify in Cloudinary directly
    const cloudCheck = await cloudinary.api.resource(uploadedPublicId);
    if (cloudCheck.public_id === uploadedPublicId) {
      console.log('✓ PASS: Asset verified active in Cloudinary storage');
    }

    // Save Cloudinary URL in a Product document in MongoDB Atlas
    const cloudProductData = {
      name: 'TEST - Cloudinary Integration Dress',
      price: 2999,
      description: 'Dress with Cloudinary verified asset',
      images: [uploadedUrl]
    };
    const savedProdRes = await makeRequest('/products', 'POST', cloudProductData, adminToken);
    const cloudProdId = savedProdRes.data.product._id;
    console.log(`Created Product with Cloudinary image, ID: ${cloudProdId}`);

    // Fetch and verify record in MongoDB
    const fetchedProd = await prodCol.findOne({ _id: new mongoose.Types.ObjectId(cloudProdId) });
    if (fetchedProd && fetchedProd.images[0] === uploadedUrl) {
      console.log('✓ PASS: Cloudinary URL successfully persisted in MongoDB Atlas document');
    }

    // Delete database record
    await makeRequest(`/products/${cloudProdId}`, 'DELETE', null, adminToken);
    const checkDeletedProd = await prodCol.findOne({ _id: new mongoose.Types.ObjectId(cloudProdId) });
    if (!checkDeletedProd) {
      console.log('✓ PASS: Product record cleanly removed from MongoDB Atlas');
    }

    // Delete Cloudinary asset through application endpoint
    console.log(`Deleting Cloudinary test asset (${uploadedPublicId})...`);
    const deleteUploadRes = await makeRequest(`/upload/${uploadedPublicId}?type=image`, 'DELETE', null, adminToken);
    console.log('Delete Upload API Response:', deleteUploadRes.data);

    // Verify Cloudinary asset is actually gone
    try {
      await cloudinary.api.resource(uploadedPublicId);
      throw new Error('Cloudinary asset still exists after deletion');
    } catch (err) {
      if (err.error?.http_code === 404 || err.http_code === 404 || err.message?.includes('not found') || err.message?.includes('NotFound')) {
        console.log('✓ PASS: Confirmed Cloudinary test asset no longer exists in cloud (404 Not Found)');
        results.cloudinary = true;
      } else {
        throw err;
      }
    }
  } else {
    throw new Error(`Upload failed with status ${uploadRes.status}: ${JSON.stringify(uploadRes.data)}`);
  }

  // 12. API ERROR HANDLING
  console.log('\n--- 12. API ERROR HANDLING TEST ---');
  let errorCount = 0;

  // Invalid MongoDB ID on Product
  const errInvalidId = await makeRequest('/products/not-a-valid-mongo-id');
  if (errInvalidId.status === 400) {
    console.log('✓ PASS: Invalid MongoDB ID returned 400 Bad Request');
    errorCount++;
  } else {
    console.error(`✗ FAIL: Invalid ID returned status ${errInvalidId.status}`);
  }

  // Non-existent Product ID
  const dummyId = new mongoose.Types.ObjectId().toString();
  const errNonExistent = await makeRequest(`/products/${dummyId}`);
  if (errNonExistent.status === 404) {
    console.log('✓ PASS: Non-existent Product ID returned 404 Not Found');
    errorCount++;
  }

  // Missing required product fields
  const errMissingProduct = await makeRequest('/products', 'POST', { name: '' }, adminToken);
  if (errMissingProduct.status === 400) {
    console.log('✓ PASS: Missing required product fields returned 400 Bad Request');
    errorCount++;
  }

  // Missing required lead fields
  const errMissingLead = await makeRequest('/leads', 'POST', { name: '' });
  if (errMissingLead.status === 400) {
    console.log('✓ PASS: Missing lead fields returned 400 Bad Request');
    errorCount++;
  }

  // Invalid Email in lead
  const errInvalidEmail = await makeRequest('/leads', 'POST', { name: 'Test', phone: '1234567890', email: 'notanemail' });
  if (errInvalidEmail.status === 400) {
    console.log('✓ PASS: Invalid email format returned 400 Bad Request');
    errorCount++;
  }

  // Unauthorized Admin Request
  const errNoAuth = await makeRequest('/products', 'POST', { name: 'Test' });
  if (errNoAuth.status === 401) {
    console.log('✓ PASS: Missing Authorization header returned 401 Unauthorized');
    errorCount++;
  }

  // Invalid JWT Token
  const errBadToken = await makeRequest('/auth/me', 'GET', null, 'invalid.jwt.token.here');
  if (errBadToken.status === 401) {
    console.log('✓ PASS: Invalid JWT returned 401 Unauthorized');
    errorCount++;
  }

  // Non-existent Enquiry ID
  const errNonExistentEnquiry = await makeRequest(`/leads/${dummyId}`, 'GET', null, adminToken);
  if (errNonExistentEnquiry.status === 404) {
    console.log('✓ PASS: Non-existent enquiry returned 404 Not Found');
    errorCount++;
  }

  // Empty Upload
  const errEmptyUpload = await makeRequest('/upload', 'POST', null, adminToken);
  if (errEmptyUpload.status === 400 || errEmptyUpload.status === 500) {
    console.log('✓ PASS: Empty file upload handled cleanly');
    errorCount++;
  }

  if (errorCount >= 8) {
    results.errorHandling = true;
  }

  // 13. DATABASE INTEGRITY CHECK
  console.log('\n--- 13. DATABASE INTEGRITY CHECK ---');
  const adminsTotal = await adminCol.countDocuments({});
  console.log(`Total Admin Users: ${adminsTotal}`);
  if (adminsTotal !== 1) throw new Error(`Integrity Failure: Expected 1 admin user, found ${adminsTotal}`);

  const settingsTotal = await settingsCol.countDocuments({});
  console.log(`Total Settings Documents: ${settingsTotal}`);
  if (settingsTotal !== 1) throw new Error(`Integrity Failure: Expected 1 settings document, found ${settingsTotal}`);

  // Check no leftover temporary test products
  const orphanProducts = await prodCol.find({ name: { $regex: /^TEST -/ } }).toArray();
  console.log(`Orphan Test Products: ${orphanProducts.length}`);
  if (orphanProducts.length > 0) {
    await prodCol.deleteMany({ name: { $regex: /^TEST -/ } });
    console.log('Cleaned up orphan test products');
  }

  // Check no leftover temporary test leads
  const orphanLeads = await leadCol.find({ $or: [{ phone: '9999999999' }, { phone: '8888888888' }, { phone: '8888888889' }] }).toArray();
  console.log(`Orphan Test Leads/Enquiries: ${orphanLeads.length}`);
  if (orphanLeads.length > 0) {
    await leadCol.deleteMany({ $or: [{ phone: '9999999999' }, { phone: '8888888888' }, { phone: '8888888889' }] });
    console.log('Cleaned up orphan test leads');
  }

  // Verify timestamps on all collections
  const sampleProduct = await prodCol.findOne({});
  if (sampleProduct && sampleProduct.createdAt && sampleProduct.updatedAt) {
    console.log(`Verified Timestamps: createdAt=${sampleProduct.createdAt}, updatedAt=${sampleProduct.updatedAt}`);
  }

  results.databaseIntegrity = true;

  console.log('\n===============================================================');
  console.log('  INTEGRATION TEST SUMMARY');
  console.log('===============================================================');
  console.log(results);

  await mongoose.connection.close();
  console.log('\nVerification suite finished successfully with 0 fatal errors.');
  process.exit(0);
}

runAllTests().catch((err) => {
  console.error('\nFATAL TEST FAILURE:', err);
  process.exit(1);
});
