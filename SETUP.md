# 🐾 Maskota - Plaquitas Identificadoras con QR

Sistema de plaquitas de identificación para mascotas con códigos QR únicos y base de datos en AWS Amplify.

## 🚀 Inicio Rápido

### 1. Conectar con AWS Amplify (Primera vez)

Tu proyecto ya está en GitHub y conectado a AWS Amplify. Ahora necesitas obtener las credenciales:

```powershell
# Opción A: Generar desde la nube (RECOMENDADO)
npm run generate-outputs

# Opción B: Descargar manualmente desde AWS Console
# 1. Ve a https://console.aws.amazon.com/amplify
# 2. Selecciona tu app
# 3. Backend environments → Download amplify_outputs.json
# 4. Guárdalo en la raíz del proyecto
```

### 2. Verificar Conexión

```powershell
npm run check-db
```

Esto verificará que tu app se conecta correctamente a AWS.

### 3. Iniciar la Aplicación

```powershell
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Acceder al Panel de Administración

URL: [http://localhost:3000/admin](http://localhost:3000/admin)  
**Contraseña**: `admin123`

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run check-db` | Verifica conexión con AWS Amplify |
| `npm run init-db` | Genera códigos iniciales en la base de datos |
| `npm run sandbox` | Inicia sandbox de Amplify (desarrollo local) |
| `npm run deploy` | Despliega el backend a AWS |
| `npm run generate-outputs` | Descarga configuración desde AWS |

## 🎯 Flujo de Trabajo

### Para Administradores

1. **Generar Códigos**:
   - Ve a `/admin`
   - Click en "Generar Códigos"
   - Elige cantidad (1-100)
   - Los códigos se crean en AWS DynamoDB

2. **Gestionar Códigos**:
   - Ver todos los códigos generados
   - Ver estado (Activado/Sin activar)
   - Eliminar códigos si es necesario

3. **Gestionar Mascotas**:
   - Ver mascotas registradas
   - Editar información
   - Eliminar registros

### Para Usuarios

1. **Activar Plaquita** (Primera vez):
   - Escanea el QR de la plaquita
   - Te lleva a `/tag/CODIGO`
   - Como no está activada, redirige a `/activate/CODIGO`
   - Completa el formulario con datos de tu mascota
   - ¡Plaquita activada!

2. **Si encuentran a tu mascota**:
   - Escanean el QR
   - Ven toda la información de tu mascota
   - Pueden llamarte directamente

## 📁 Estructura del Proyecto

```
maskota/
├── app/                          # Frontend Next.js
│   ├── page.tsx                 # Landing page
│   ├── admin/                   # Panel de administración
│   │   ├── page.tsx            # Dashboard admin
│   │   └── admin.css
│   ├── activate/[code]/        # Activación de plaquitas
│   │   ├── page.tsx
│   │   └── activate.css
│   └── tag/[code]/             # Visualización de mascotas
│       ├── page.tsx
│       └── tag.css
├── amplify/                     # Backend AWS Amplify
│   ├── backend.ts              # Configuración del backend
│   ├── auth/                   # Autenticación
│   │   └── resource.ts
│   └── data/                   # Base de datos
│       └── resource.ts         # Schema (Tag y Pet)
├── scripts/                     # Scripts de utilidad
│   ├── check-connection.ts     # Verificar conexión DB
│   └── init-database.ts        # Inicializar DB con códigos
├── amplify.yml                  # CI/CD de AWS Amplify
└── package.json
```

## 🗄️ Esquema de Base de Datos

### Tabla: Tag (Plaquitas)
- `code` (string): Código único (ej: "1eR38G")
- `isActive` (boolean): Si está activada
- `activatedAt` (datetime): Fecha de activación

### Tabla: Pet (Mascotas)
- `tagCode` (string): Código de la plaquita
- `name` (string): Nombre de la mascota
- `species` (string): Especie (perro, gato, etc)
- `breed` (string): Raza
- `color` (string): Color
- `age` (string): Edad
- `photo` (url): URL de foto
- `ownerName` (string): Nombre del dueño
- `ownerPhone` (string): Teléfono
- `ownerEmail` (string): Email
- `ownerAddress` (string): Dirección
- `notes` (string): Notas adicionales

## 🔒 Seguridad

- Panel admin protegido con contraseña
- Base de datos con API Key de AWS
- Credenciales en `amplify_outputs.json` (no se sube a GitHub)

### Cambiar Contraseña de Admin

Edita `app/admin/page.tsx`, línea 26:

```typescript
const ADMIN_PASSWORD = "tu_nueva_contraseña";
```

## 🚢 Deployment

### Automático (GitHub → AWS Amplify)

1. Haz commit y push:
   ```powershell
   git add .
   git commit -m "Tu mensaje"
   git push
   ```

2. AWS Amplify despliega automáticamente:
   - Build del frontend
   - Deploy del backend
   - Actualización de la base de datos

### Manual (Desde tu PC)

```powershell
# Desplegar backend
npm run deploy

# O usar sandbox para desarrollo
npm run sandbox
```

## 🆘 Solución de Problemas

### Error: "Cannot find module '@/amplify_outputs.json'"

**Causa**: No has generado las credenciales de AWS  
**Solución**:
```powershell
npm run generate-outputs
```

### Error: "Not authorized to perform this action"

**Causa**: Credenciales de AWS no configuradas  
**Solución**:
1. Instala AWS CLI: `winget install Amazon.AWSCLI`
2. Configura: `aws configure`
3. Ingresa tus credenciales de AWS

### La base de datos no responde

**Causa**: Backend no desplegado  
**Solución**:
```powershell
npm run check-db  # Verificar estado
npm run deploy    # Desplegar backend
```

### No puedo generar códigos desde /admin

**Causa**: amplify_outputs.json desactualizado  
**Solución**:
```powershell
npm run generate-outputs
npm run dev
```

## 📊 Ver Datos en AWS

1. **DynamoDB** (tablas):  
   https://console.aws.amazon.com/dynamodb

2. **Amplify Console** (app):  
   https://console.aws.amazon.com/amplify

3. **AppSync** (GraphQL API):  
   https://console.aws.amazon.com/appsync

## 🎨 Personalización

### Cambiar Colores

Edita `app/app.css` y busca:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Agregar Campos a Mascota

1. Edita `amplify/data/resource.ts`
2. Agrega campos al modelo `Pet`
3. Haz push a GitHub
4. AWS Amplify actualiza automáticamente

## 📝 Licencia

Este proyecto está bajo la licencia especificada en [LICENSE](LICENSE).

## 🤝 Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al equipo de desarrollo.
