/**
 * Script para verificar la conexión con AWS Amplify
 * y mostrar información sobre el estado de la base de datos
 */

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { Amplify } from "aws-amplify";

// Importar configuración
let outputs;
try {
  outputs = require("../amplify_outputs.json");
  console.log("✅ amplify_outputs.json encontrado\n");
} catch (error) {
  console.error("❌ Error: No se encontró amplify_outputs.json\n");
  console.log("📋 Sigue estos pasos:\n");
  console.log("OPCIÓN 1 - Desde AWS Console:");
  console.log("  1. Ve a https://console.aws.amazon.com/amplify");
  console.log("  2. Selecciona tu app");
  console.log("  3. Backend environments → Download amplify_outputs.json");
  console.log("  4. Guárdalo en la raíz del proyecto\n");
  console.log("OPCIÓN 2 - Desde terminal:");
  console.log("  npx ampx generate outputs --branch main\n");
  process.exit(1);
}

Amplify.configure(outputs);
const client = generateClient<Schema>();

async function checkConnection() {
  console.log("🔍 Verificando conexión con AWS Amplify...\n");

  try {
    // Intentar listar Tags
    console.log("📡 Consultando tabla Tag...");
    const { data: tags } = await client.models.Tag.list();
    console.log(`✅ Conexión exitosa - Tags encontrados: ${tags?.length || 0}`);

    // Intentar listar Pets
    console.log("📡 Consultando tabla Pet...");
    const { data: pets } = await client.models.Pet.list();
    console.log(`✅ Conexión exitosa - Pets encontrados: ${pets?.length || 0}`);

    console.log("\n📊 Resumen de Base de Datos:");
    console.log("─────────────────────────────");
    console.log(`  Total de códigos: ${tags?.length || 0}`);
    console.log(`  Códigos activos: ${tags?.filter((t) => t.isActive).length || 0}`);
    console.log(`  Códigos sin activar: ${tags?.filter((t) => !t.isActive).length || 0}`);
    console.log(`  Mascotas registradas: ${pets?.length || 0}`);
    console.log("─────────────────────────────\n");

    if (tags && tags.length > 0) {
      console.log("🏷️  Últimos 5 códigos:");
      tags.slice(0, 5).forEach((tag, index) => {
        const status = tag.isActive ? "✅ Activado" : "⏳ Sin activar";
        console.log(`  ${index + 1}. ${tag.code} - ${status}`);
      });
      console.log("");
    } else {
      console.log("ℹ️  No hay códigos generados aún.");
      console.log("💡 Ejecuta: npm run init-db para generar códigos\n");
    }

    console.log("🎉 ¡Todo funciona correctamente!");
    console.log("\n💡 Próximos pasos:");
    console.log("  • Accede a http://localhost:3000/admin");
    console.log("  • Contraseña: admin123");
    console.log("  • Genera códigos desde el panel\n");

  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    console.log("\n🔧 Posibles soluciones:");
    console.log("1. Verifica que el backend esté desplegado en AWS Amplify");
    console.log("2. Asegúrate de tener amplify_outputs.json actualizado");
    console.log("3. Verifica tu conexión a internet");
    console.log("4. Revisa los permisos en AWS IAM\n");
    process.exit(1);
  }
}

// Ejecutar
checkConnection().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("💥 Error fatal:", error);
  process.exit(1);
});
