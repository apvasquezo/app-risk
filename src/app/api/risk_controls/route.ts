// app/api/risk_controls/route.ts

export async function POST(request: Request) {
  try {
    const { field1, field2, field3, field4, field5 } = await request.json();
    
    if (!field1 || !field2 || !field3 || !field4 || !field5) {
      return Response.json(
        { error: 'Faltan datos del riesgo para generar sugerencias' },
        { status: 400 }
      );
    }

    const prompt = `Actúa como un experto en gestión de riesgos. Necesito que me proporciones tres sugerencias de control cortas para el siguiente riesgo:

**Información del Riesgo:**
* **Tipo de Riesgo:** ${field1}
* **Factor de Riesgo:** ${field2}
* **Proceso donde se generó:** ${field3}
* **Canal:** ${field4}
* **Evento de Riesgo (Consecuencia):** ${field5}

**Instrucciones:**
Por favor responde ÚNICAMENTE con un objeto JSON en el siguiente formato, sin texto adicional:

{
  "preventivo": "Control preventivo específico",
  "detectivo": "Control detectivo específico", 
  "correctivo": "Control correctivo específico"
}`;

    console.log("Enviando petición a Gemini...");

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCg2kgMusMa3mnk-_PGEX2n9g1ah3VNLAs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    console.log("Respuesta de Gemini recibida:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Gemini:", errorData);
      return Response.json(
        { error: errorData.error?.message || `Error HTTP: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Datos recibidos de Gemini:", data);

    let parsedContent;
    try {
      const text = data.candidates[0].content.parts[0].text;
      console.log("Texto crudo de Gemini:", text);
      
      // Limpiar el texto antes de parsearlo
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedContent = JSON.parse(cleanText);
      
    } catch (error) {
      console.error("Error al parsear el JSON:", error);
      console.error("Texto recibido:", data.candidates[0].content.parts[0].text);
      return Response.json(
        { error: 'El contenido generado no es un JSON válido' },
        { status: 500 }
      );
    }

    console.log("Contenido parseado exitosamente:", parsedContent);
    return Response.json(parsedContent);

  } catch (error) {
    console.error('Error en API route:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}