# 📘 Instrucciones para Conectar Base de Datos AWS Amplify

## ✅ Tu Proyecto Ya Está Configurado

Tu código ya tiene todo configurado para conectarse a AWS Amplify:
- ✅ Backend configurado en `amplify/backend.ts`
- ✅ Esquema de base de datos en `amplify/data/resource.ts`
- ✅ Amplify.yml para CI/CD automático

## 🎯 Lo Que Necesitas Hacer

### OPCIÓN A: Despliegue Automático (RECOMENDADO)

Ya que tu proyecto está en GitHub y conectado a AWS Amplify:

1. **Haz push a GitHub**:
   ```powershell
   git add .
   git commit -m "Actualizar base de datos"
   git push
   ```

2. **AWS Amplify desplegará automáticamente**:
   - Ve a: https://console.aws.amazon.com/amplify
   - Selecciona tu app
   - El despliegue se ejecuta automáticamente

3. **Descarga amplify_outputs.json**:
   - En AWS Amplify Console → "Backend environments"
   - Click "Download amplify_outputs.json"
   - Guarda el archivo en la raíz del proyecto (donde está package.json)
   - NO lo subas a GitHub (ya está en .gitignore)

4. **Para desarrollo local** (opcional):
   ```powershell
   # Instala amplify CLI si no lo tienes
   npm install -g @aws-amplify/backend-cli
   
   # Conecta con el backend desplegado
   npx ampx generate outputs --branch main
   ```

### OPCIÓN B: Despliegue Manual desde tu PC

1. **Configura AWS CLI** (solo primera vez):
   ```powershell
   # Instala AWS CLI
   winget install Amazon.AWSCLI
   
   # Configura credenciales
   aws configure
   # Te pedirá:
   # - AWS Access Key ID
   # - AWS Secret Access Key
   # - Region (ej: us-east-1)
   ```

2. **Despliega el backend**:
   ```powershell
   # Opción A: Sandbox (para desarrollo)
   npx ampx sandbox
   
   # Opción B: Despliegue permanente
   npx ampx deploy --branch main
   ```

3. **El archivo amplify_outputs.json se genera automáticamente**

## 🗄️ Verificar que la Base de Datos Funciona

1. **Inicia tu app localmente**:
   ```powershell
   npm run dev
   ```

2. **Accede al panel de admin**:
   ```
   http://localhost:3000/admin
   Contraseña: admin123
   ```

3. **Genera códigos de prueba**:
   - Click en "Generar Códigos"
   - Ingresa cantidad (ej: 5)
   - Los códigos se crearán en DynamoDB

4. **Prueba un código**:
   - Toma un código generado (ej: aB3xY9)
   - Ve a: http://localhost:3000/tag/aB3xY9
   - Deberías ver la página de activación

## 🔍 Ver tus Datos en AWS

1. **DynamoDB Console**:
   - Ve a: https://console.aws.amazon.com/dynamodb
   - Busca las tablas que empiezan con tu app name
   - Verás: Tag y Pet

2. **AppSync Console** (GraphQL API):
   - Ve a: https://console.aws.amazon.com/appsync
   - Ahí está tu API para hacer queries

## ⚠️ Importante

- ✅ `amplify_outputs.json` NO debe subirse a GitHub (ya está en .gitignore)
- ✅ Este archivo contiene las credenciales de conexión
- ✅ Cada desarrollador debe generar su propia copia
- ✅ En producción, AWS Amplify genera este archivo automáticamente

## 🆘 Solución de Problemas

### Error: "Cannot find module '@/amplify_outputs.json'"
**Solución**: Genera el archivo con `npx ampx generate outputs` o descárgalo de AWS Console

### Error: "Not authorized to perform this action"
**Solución**: Configura tus credenciales de AWS con `aws configure`

### La base de datos no se crea
**Solución**: Verifica que el despliegue en AWS Amplify Console haya terminado exitosamente

## 📞 Comandos Útiles

```powershell
# Ver estado del backend
npx ampx sandbox

# Generar outputs desde backend desplegado
npx ampx generate outputs --branch main

# Ver logs de deployment
# (Ve a AWS Amplify Console)
```

## ✨ Próximos Pasos

Una vez que tengas `amplify_outputs.json`:

1. ✅ La app se conectará automáticamente a AWS
2. ✅ Podrás generar códigos desde /admin
3. ✅ Los códigos se guardarán en DynamoDB
4. ✅ Las plaquitas funcionarán al escanear el QR

¡Tu app estará 100% funcional!
