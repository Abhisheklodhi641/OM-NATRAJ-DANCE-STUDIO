import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const headers = {};
    let data = null;

    if (body) {
      data = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(data);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, { method, headers }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

async function runTestSuite() {
  console.log('--- STARTING COMPREHENSIVE PRODUCTION API TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const health = await request('/health');
    assert(health.status === 200 && health.data.success === true, 'GET /api/health returns 200 and success: true');

    // 2. Auth: Bad Login
    const badLogin = await request('/auth/login', 'POST', { username: 'admin', password: 'wrongpassword' });
    assert(badLogin.status === 401 && badLogin.data.success === false, 'POST /api/auth/login invalid credentials returns 401');

    // 3. Auth: Valid Login
    const login = await request('/auth/login', 'POST', { username: 'admin', password: 'omnatrajadmin' });
    assert(login.status === 200 && login.data.token && !login.data.admin.password, 'POST /api/auth/login succeeds and does not expose password');
    const token = login.data.token;

    // 4. Unauthorized Access to Protected Route
    const unauthLeads = await request('/leads');
    assert(unauthLeads.status === 401, 'GET /api/leads without token is blocked with 401');

    // 5. Public Lead Submission: Missing required fields
    const invalidLead = await request('/leads', 'POST', { name: '' });
    assert(invalidLead.status === 400 && invalidLead.data.success === false, 'POST /api/leads with missing fields returns 400');

    // 6. Public Lead Submission: Valid
    const validLead = await request('/leads', 'POST', {
      name: 'Rohan Sharma',
      phone: '+91 98930 11223',
      email: 'rohan@example.com',
      interestedIn: 'Bollywood Commercial',
      preferredClass: 'Evening Regular',
      message: 'Excited to start dance training!'
    });
    assert(validLead.status === 201 && validLead.data.lead._id, 'POST /api/leads creates lead with 201 Created');
    const leadId = validLead.data.lead._id;

    // 7. Admin Leads Management
    const leadsList = await request('/leads', 'GET', null, token);
    assert(leadsList.status === 200 && Array.isArray(leadsList.data.leads), 'GET /api/leads returns authorized lead list');

    const updateLead = await request(`/leads/${leadId}`, 'PATCH', { status: 'CONTACTED', notes: 'Called and invited for Saturday trial.' }, token);
    assert(updateLead.status === 200 && updateLead.data.lead.status === 'CONTACTED', 'PATCH /api/leads/:id updates status');

    // 8. Public & Admin Classes CRUD
    const classesList = await request('/classes');
    assert(classesList.status === 200 && Array.isArray(classesList.data.classes), 'GET /api/classes returns active classes');

    const newClass = await request('/classes', 'POST', {
      name: 'Test Hip Hop Masterclass',
      danceStyle: 'Hip-Hop',
      level: 'Intermediate',
      schedule: 'Mon/Wed/Fri 7pm',
      duration: '60 mins',
      price: 2500,
      description: 'Dynamic urban choreography',
      status: 'active'
    }, token);
    assert(newClass.status === 201 && newClass.data.class._id, 'POST /api/classes creates class with 201');
    const classId = newClass.data.class._id;

    const deleteClass = await request(`/classes/${classId}`, 'DELETE', null, token);
    assert(deleteClass.status === 200, 'DELETE /api/classes/:id deletes class cleanly');

    // 9. Public & Admin Events CRUD
    const eventsList = await request('/events');
    assert(eventsList.status === 200 && Array.isArray(eventsList.data.events), 'GET /api/events returns event list');

    const newEvent = await request('/events', 'POST', {
      name: 'Test Garba Workshop',
      date: 'NOV 10, 2026',
      time: '6:00 PM',
      location: 'Main Arena',
      description: 'Energetic workshop',
      badge: 'Workshop',
      status: 'upcoming'
    }, token);
    assert(newEvent.status === 201 && newEvent.data.event._id, 'POST /api/events creates event with 201');
    const eventId = newEvent.data.event._id;

    const deleteEvent = await request(`/events/${eventId}`, 'DELETE', null, token);
    assert(deleteEvent.status === 200, 'DELETE /api/events/:id deletes event cleanly');

    // 10. Public & Admin Products CRUD
    const productsList = await request('/products');
    assert(productsList.status === 200 && Array.isArray(productsList.data.products), 'GET /api/products returns products');

    const newProduct = await request('/products', 'POST', {
      name: 'Test Dance Ghungroo 100 Bells',
      category: 'accessories',
      price: 1299,
      description: 'Traditional brass dance bells',
      image: '/images/ghungroo.jpg',
      inStock: true
    }, token);
    assert(newProduct.status === 201 && newProduct.data.product._id, 'POST /api/products creates product with 201');
    const prodId = newProduct.data.product._id;

    const deleteProduct = await request(`/products/${prodId}`, 'DELETE', null, token);
    assert(deleteProduct.status === 200, 'DELETE /api/products/:id deletes product cleanly');

    // 11. Public & Admin Gallery & Videos
    const gallery = await request('/gallery');
    assert(gallery.status === 200 && Array.isArray(gallery.data.items), 'GET /api/gallery returns items');

    const videos = await request('/videos');
    assert(videos.status === 200 && Array.isArray(videos.data.videos), 'GET /api/videos returns videos');

    // 12. Public & Admin Testimonials
    const testimonials = await request('/testimonials');
    assert(testimonials.status === 200 && Array.isArray(testimonials.data.testimonials), 'GET /api/testimonials returns testimonials');

    // 13. Settings Verification
    const settings = await request('/settings');
    assert(settings.status === 200 && settings.data.settings.studioName, 'GET /api/settings returns studio settings');

    // 14. 404 Route Verification
    const notFound = await request('/random-endpoint');
    assert(notFound.status === 404, 'Unknown endpoint returns 404');

    // 15. Clean up test lead
    await request(`/leads/${leadId}`, 'DELETE', null, token);

    console.log(`\n--- TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED ---`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTestSuite();
