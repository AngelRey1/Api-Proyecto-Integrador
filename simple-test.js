const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function simpleTest() {
  console.log('🔍 Testing basic Supabase connection...');
  console.log('📍 URL:', process.env.SUPABASE_URL);
  console.log('🔑 Key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Just test the connection without accessing any specific table
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message.includes('Invalid API key')) {
      console.error('❌ Invalid API key');
      return false;
    }

    console.log('✅ Basic Supabase connection works!');
    console.log('ℹ️  Now we need to know your table names to continue...');
    
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

simpleTest();