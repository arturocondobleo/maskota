/**
 * Script para inicializar la base de datos con códigos de ejemplo
 * Ejecutar después de tener amplify_outputs.json
 */

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { Amplify } from "aws-amplify";

// Importar configuración
let outputs;
try {
  outputs = require("../amplify_outputs.json");
} catch (error) {
  console.error("❌ Error: No se encontró amplify_outputs.json");
  console.log("\n📋 Pasos para obtener amplify_outputs.json:");
  console.log("1. Despliega tu app en AWS Amplify desde GitHub");
  console.log("2. Ve a AWS Amplify Console → Backend environments");
  console.log("3. Click en 'Download amplify_outputs.json'");
  console.log("4. Guarda el archivo en la raíz del proyecto\n");
  console.log("O ejecuta: npx ampx generate outputs --branch main\n");
  process.exit(1);
}

Amplify.configure(outputs);
const client = generateClient<Schema>();

// Función para generar código único
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Función principal
async function initializeDatabase() {
  console.log("🚀 Inicializando base de datos de Maskota...\n");

  try {
    // Verificar si ya hay datos
    const { data: existingTags } = await client.models.Tag.list();
    
    if (existingTags && existingTags.length > 0) {
      console.log(`ℹ️  Ya existen ${existingTags.length} códigos en la base de datos`);
      const response = await askQuestion(
        "¿Deseas agregar más códigos? (s/n): "
      );
      if (response.toLowerCase() !== "s") {
        console.log("✅ Proceso cancelado");
        return;
      }
    }

    // Preguntar cuántos códigos generar
    const numCodes = await askQuestion(
      "¿Cuántos códigos de plaquitas deseas generar? (1-100): "
    );
    const count = parseInt(numCodes);

    if (isNaN(count) || count < 1 || count > 100) {
      console.log("❌ Número inválido. Debe ser entre 1 y 100");
      return;
    }

    console.log(`\n📝 Generando ${count} código(s)...\n`);

    // Generar códigos
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = generateCode();
      
      try {
        await client.models.Tag.create({
          code: code,
          isActive: false,
        });
        
        codes.push(code);
        console.log(`✅ [${i + 1}/${count}] Código creado: ${code}`);
      } catch (error) {
        console.log(`⚠️  [${i + 1}/${count}] Error al crear código: ${error}`);
      }
    }

    console.log(`\n🎉 ¡Proceso completado!`);
    console.log(`📊 Total de códigos generados: ${codes.length}`);
    
    if (codes.length > 0) {
      console.log(`\n📋 Códigos generados:`);
      codes.forEach((code, index) => {
        console.log(`   ${index + 1}. ${code} → https://tu-dominio.com/tag/${code}`);
      });
    }

    console.log(`\n💡 Próximos pasos:`);
    console.log(`1. Ve a http://localhost:3000/admin para gestionar los códigos`);
    console.log(`2. Genera QR codes con las URLs de cada código`);
    console.log(`3. Imprime las plaquitas con los QR codes`);
    console.log(`4. Al escanear por primera vez, se activará la plaquita\n`);

  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    console.log("\n🔍 Verifica que:");
    console.log("1. amplify_outputs.json esté en la raíz del proyecto");
    console.log("2. Tu backend esté desplegado en AWS Amplify");
    console.log("3. Tengas conexión a internet\n");
  }
}

// Helper para leer input del usuario
function askQuestion(question: string): Promise<string> {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Ejecutar
initializeDatabase().then(() => {
  console.log("👋 Hasta luego!");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Error fatal:", error);
  process.exit(1);
});
