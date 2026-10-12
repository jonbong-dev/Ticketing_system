// Password Hash Generator Utility
// Run this in browser console to generate correct hashes

export async function generatePasswordHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate hashes for default passwords
export async function generateDefaultHashes() {
  const adminHash = await generatePasswordHash('admin123');
  const customerHash = await generatePasswordHash('customer123');
  
  console.log('Default Password Hashes:');
  console.log('========================');
  console.log(`Admin (admin123): ${adminHash}`);
  console.log(`Customer (customer123): ${customerHash}`);
  console.log('');
  console.log('Copy these hashes to src/authService.ts');
  
  return { adminHash, customerHash };
}

// Run this in browser console to see the hashes:
// import('./src/passwordGenerator').then(m => m.generateDefaultHashes())
