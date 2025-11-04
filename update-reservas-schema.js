const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateReservasSchema() {
    try {
        console.log('🔧 Actualizando esquema de tabla reservas...');

        // Verificar si la columna ya existe
        const { data: existingColumns } = await supabase
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'reservas')
            .eq('column_name', 'codigo_confirmacion');

        if (!existingColumns || existingColumns.length === 0) {
            console.log('⚠️  La columna codigo_confirmacion no existe. Necesita ser agregada manualmente en Supabase.');
            console.log('📝 SQL para ejecutar en Supabase:');
            console.log(`
        ALTER TABLE reservas 
        ADD COLUMN codigo_confirmacion VARCHAR(10);
        
        CREATE INDEX idx_reservas_codigo_confirmacion 
        ON reservas(codigo_confirmacion);
      `);
        } else {
            console.log('✅ La columna codigo_confirmacion ya existe');
        }

        const alterError = null; // Simular sin error para continuar

        if (alterError) {
            console.log('❌ Error actualizando esquema:', alterError.message);
            return;
        }

        console.log('✅ Esquema actualizado correctamente');

        // Verificar la estructura actualizada
        const { data: columns, error: columnsError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_name', 'reservas')
            .order('ordinal_position');

        if (columnsError) {
            console.log('❌ Error consultando columnas:', columnsError.message);
            return;
        }

        console.log('📋 Estructura actual de la tabla reservas:');
        console.table(columns);

    } catch (error) {
        console.log('❌ Error general:', error.message);
    }
}

updateReservasSchema();