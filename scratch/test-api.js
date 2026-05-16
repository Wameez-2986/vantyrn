// Using global fetch (Node 18+)

async function testApi() {
  const baseUrl = 'http://localhost:3000'; // Assuming dev server is here
  
  // Test Dashboard Stats
  console.log('Testing Dashboard Stats...');
  try {
    const res = await fetch(`${baseUrl}/api/dashboard/stats`);
    const data = await res.json();
    console.log('Dashboard Stats Status:', res.status);
    if (!res.ok) console.error('Error:', data);
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }

  // Test Orders
  console.log('\nTesting Orders List...');
  try {
    const res = await fetch(`${baseUrl}/api/orders`);
    const data = await res.json();
    console.log('Orders List Status:', res.status);
    if (!res.ok) console.error('Error:', data);
    
    if (data.length > 0) {
      const orderId = data[0].id;
      console.log(`\nTesting Order Detail (${orderId})...`);
      const resDet = await fetch(`${baseUrl}/api/orders/${orderId}`);
      const dataDet = await resDet.json();
      console.log('Order Detail Status:', resDet.status);
      if (!resDet.ok) console.error('Error:', dataDet);
    }
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }

  // Test Vendors
  console.log('\nTesting Vendors List...');
  try {
    const res = await fetch(`${baseUrl}/api/vendors`);
    const data = await res.json();
    console.log('Vendors List Status:', res.status);
    if (!res.ok) console.error('Error:', data);
    
    if (data.length > 0) {
      const vendorId = data[0].id;
      console.log(`\nTesting Vendor Detail (${vendorId})...`);
      const resDet = await fetch(`${baseUrl}/api/vendors/${vendorId}`);
      const dataDet = await resDet.json();
      console.log('Vendor Detail Status:', resDet.status);
      if (!resDet.ok) console.error('Error:', dataDet);
    }
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }

  // Test Reports
  console.log('\nTesting Reports...');
  try {
    const res = await fetch(`${baseUrl}/api/reports`);
    const data = await res.json();
    console.log('Reports Status:', res.status);
    if (!res.ok) console.error('Error:', data);
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

testApi();
