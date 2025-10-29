const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testing Supabase connection...');

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        // First, let's check what tables are available
        console.log('📋 Checking available tables...');

        // Try to get schema information
        const { data: tables, error: schemaError } = await supabase.rpc('get_schema_tables');

        if (schemaError) {
            console.log('ℹ️  Cannot get schema info, trying direct table access...');
        } else {
            console.log('📊 Available tables:', tables);
        }

        // Test connection with your actual tables
        console.log('🔍 Testing Usuario table...');
        const { data, error } = await supabase
            .from('Usuario')
            .select('*')
            .limit(3);

        if (error) {
            console.error('❌ Connection to Usuario table failed:', error.message);
            
            // Try other tables from your schema (both cases)
            const tableNames = [
                'usuario', 'Usuario', 'USUARIO',
                'entrenador', 'Entrenador', 'ENTRENADOR',
                'cliente', 'Cliente', 'CLIENTE',
                'deporte', 'Deporte', 'DEPORTE',
                'catalogoentrenamiento', 'CatalogoEntrenamiento', 'CATALOGOENTRENAMIENTO'
            ];
            
            for (const tableName of tableNames) {
                console.log(`🔍 Trying table: ${tableName}`);
                const { data: testData, error: testError } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1);

                if (!testError) {
                    console.log(`✅ Found table: ${tableName}`);
                    console.log('📊 Sample data:', testData);
                    return true;
                }
            }

            return false;
        }

        console.log('✅ Supabase connection successful!');
        console.log('📊 Sample data from Usuario table:', data);

        // Test if we can count records
        const { count, error: countError } = await supabase
            .from('Usuario')
            .select('*', { count: 'exact', head: true });

        if (!countError) {
            console.log(`📈 Total usuarios in database: ${count}`);
        }

        return true;
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        return false;
    }
}

testConnection();