import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== SCHEMA DE DATOS PARA PLAQUITAS DE IDENTIFICACIÓN DE MASCOTAS ========
Este esquema define:
- Tag: Plaquitas con código QR único
- Pet: Datos de la mascota asociada a una plaquita activada
=========================================================================*/
const schema = a.schema({
  Tag: a
    .model({
      code: a.string().required(), // Código único tipo "1eR38G"
      isActive: a.boolean().default(false), // Si la plaquita está activada
      activatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  Pet: a
    .model({
      tagCode: a.string().required(), // Código de la plaquita asociada
      name: a.string().required(), // Nombre de la mascota
      species: a.string(), // Especie (perro, gato, etc)
      breed: a.string(), // Raza
      color: a.string(), // Color
      age: a.string(), // Edad
      photo: a.url(), // Foto de la mascota
      ownerName: a.string().required(), // Nombre del dueño
      ownerPhone: a.string().required(), // Teléfono del dueño
      ownerEmail: a.string(), // Email del dueño
      ownerAddress: a.string(), // Dirección
      notes: a.string(), // Notas adicionales
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
