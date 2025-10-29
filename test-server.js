// Simple test to start the server and test endpoints
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test endpoint
app.get('/test/usuarios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuario')
            .select('id_usuario, nombre, apellido, email, rol, creado_en')
            .limit(10);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            success: true,
            data,
            total: data.length,
            message: 'Usuarios obtenidos exitosamente'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create user endpoint
app.post('/test/usuarios', async (req, res) => {
    try {
        const { nombre, apellido, email, contrasena, rol } = req.body;

        const { data, error } = await supabase
            .from('usuario')
            .insert([{ nombre, apellido, email, contrasena, rol }])
            .select('id_usuario, nombre, apellido, email, rol, creado_en')
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            success: true,
            data,
            message: 'Usuario creado exitosamente'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🧪 Test server running on http://localhost:${PORT}`);
    console.log('📋 Test endpoints:');
    console.log(`   GET  http://localhost:${PORT}/test/usuarios`);
    console.log(`   POST http://localhost:${PORT}/test/usuarios`);
    console.log('');
    console.log('🔧 To test POST, use:');
    console.log(`curl -X POST http://localhost:${PORT}/test/usuarios \\`);
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"nombre":"Ana","apellido":"García","email":"ana@ejemplo.com","contrasena":"123456","rol":"ENTRENADOR"}\'');
});