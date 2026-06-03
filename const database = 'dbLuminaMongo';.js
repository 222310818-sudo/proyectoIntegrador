const database = 'dbLuminaMongo';

use(database);
/*
db.createCollection("solicitudes_detalle", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_conversion_mysql", "id_documento_mysql", "tipo", "estado", "fecha_generacion"],
      properties: {
        id_conversion_mysql: { bsonType: "int" },
        id_documento_mysql:  { bsonType: "int" },
        tipo:                { bsonType: "string", enum: ["audio", "braille"] },
        estado:              { bsonType: "string", enum: ["procesando", "completado", "error"] },
        audios: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              parte:             { bsonType: "int" },
              texto:             { bsonType: "string" },
              ruta:              { bsonType: "string" },
              duracion_segundos: { bsonType: "int" }
            }
          }
        },
        braille: {
          bsonType: "object",
          properties: {
            formato:   { bsonType: "string", enum: ["grado1", "grado2"] },
            contenido: { bsonType: "string" }
          }
        },
        fecha_generacion: { bsonType: "date" }
      }
    }
  }
});*/
/*
db.solicitudes_detalle.insertMany([
  {
    id_conversion_mysql: 10,
    id_documento_mysql:  1,
    tipo:                "audio",
    estado:              "completado",
    audios: [
      { parte: 1, texto: "Introducción...", ruta: "/audios/doc1_parte1.mp3", duracion_segundos: 15 },
      { parte: 2, texto: "Siguiente sección...", ruta: "/audios/doc1_parte2.mp3", duracion_segundos: 20 }
    ],
    braille: null,
    fecha_generacion: new Date()
  }
]);*/

// Colección: documentos
/*
db.createCollection("documentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_documento_mysql", "id_usuario", "nombre_original", "fecha_subida"],
      properties: {
        id_documento_mysql: { bsonType: "int" },
        id_usuario:         { bsonType: "int" },
        nombre_original:    { bsonType: "string" },
        texto_extraido:     { bsonType: "string" },
        estructura: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              tipo:  { bsonType: "string", enum: ["titulo", "parrafo", "lista", "imagen"] },
              texto: { bsonType: "string" }
            }
          }
        },
        paginas: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              numero:    { bsonType: "int" },
              contenido: { bsonType: "string" }
            }
          }
        },
        metadata: {
          bsonType: "object",
          properties: {
            idioma:          { bsonType: "string" },
            paginas_totales: { bsonType: "int" }
          }
        },
        fecha_subida: { bsonType: "date" }
      }
    }
  }
});*/
