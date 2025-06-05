export async function POST(request: Request) {
  try {
    const { field1, field2, field3, field4, field5 } = await request.json()
    
    if (!field1 || !field2 || !field3 || !field4 || !field5) {
      return Response.json(
        { error: 'Faltan datos del riesgo para generar sugerencias' },
        { status: 400 }
      )
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
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY_OPENAI}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(
        { error: errorData.error?.message || `Error HTTP: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return Response.json(data.choices[0].message.content)
    
  } catch (error) {
    console.error('Error en API route:', error)
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}