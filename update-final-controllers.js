const fs = require('fs');

// Actualizar UsuarioFinalController - método getById
const usuarioController = fs.readFileSync('src/presentation/controllers/final/UsuarioFinalController.ts', 'utf8');

const updatedUsuarioController = usuarioController.replace(
  /async getById\(req: Request, res: Response\): Promise<void> \{[\s\S]*?\}\s*$/m,
  `async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de usuario inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const usuario = await this.userUseCases.getUserById(id);
      
      // Remover contraseña de la respuesta
      const { contrasena, ...usuarioSinPassword } = usuario;
      
      res.status(200).json({
        success: true,
        data: usuarioSinPassword
      });
      
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Usuario no encontrado')) {
        res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
          code: "USUARIO_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, apellido, email, contrasena, rol } = req.body;
      
      // Validaciones
      if (!nombre || !apellido || !email || !contrasena || !rol) {
        res.status(400).json({
          success: false,
          error: "Todos los campos son requeridos",
          code: "CAMPOS_REQUERIDOS"
        });
        return;
      }
      
      // Validar contraseña
      const passwordValidation = PasswordUtils.validatePassword(contrasena);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: "Contraseña no cumple con los requisitos",
          code: "CONTRASENA_INVALIDA",
          detalles: passwordValidation.errors.join(', ')
        });
        return;
      }
      
      // Hashear contraseña
      const hashedPassword = await PasswordUtils.hashPassword(contrasena);
      
      const nuevoUsuario = await this.userUseCases.createUser({
        nombre,
        apellido,
        email,
        contrasena: hashedPassword,
        rol
      });
      
      // Remover contraseña de la respuesta
      const { contrasena: _, ...usuarioSinPassword } = nuevoUsuario;
      
      res.status(201).json({
        success: true,
        data: usuarioSinPassword,
        message: "Usuario creado exitosamente"
      });
      
    } catch (error) {
      console.error('Error creando usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Ya existe un usuario con este email')) {
        res.status(400).json({
          success: false,
          error: "Ya existe un usuario con este email",
          code: "EMAIL_DUPLICADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de usuario inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const usuarioActualizado = await this.userUseCases.updateUser(id, updateData);
      
      // Remover contraseña de la respuesta
      const { contrasena, ...usuarioSinPassword } = usuarioActualizado;
      
      res.status(200).json({
        success: true,
        data: usuarioSinPassword,
        message: "Usuario actualizado exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Usuario no encontrado')) {
        res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
          code: "USUARIO_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de usuario inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      await this.userUseCases.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente"
      });
      
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Usuario no encontrado')) {
        res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
          code: "USUARIO_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }`
);

fs.writeFileSync('src/presentation/controllers/final/UsuarioFinalController.ts', updatedUsuarioController);

console.log('✅ UsuarioFinalController actualizado con conexión a base de datos');
console.log('🎉 Controladores actualizados exitosamente');