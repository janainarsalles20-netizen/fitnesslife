import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      )
    }

    // Chamar OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analise esta imagem de comida e forneça uma estimativa nutricional detalhada. 
                
Retorne APENAS um JSON válido (sem markdown, sem explicações) no seguinte formato:
{
  "calories": número_total_de_calorias,
  "protein": gramas_de_proteína,
  "carbs": gramas_de_carboidratos,
  "fat": gramas_de_gordura,
  "foods": ["lista", "de", "alimentos", "identificados"],
  "suggestions": ["sugestão 1 para melhorar a refeição", "sugestão 2", "sugestão 3"]
}

Seja preciso nas estimativas nutricionais baseado no tamanho das porções visíveis.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API Error:', errorData)
      return NextResponse.json(
        { error: 'Erro ao analisar imagem com IA' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse do JSON retornado pela IA
    let analysis
    try {
      // Remove markdown code blocks se existirem
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      analysis = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError)
      console.error('Conteúdo recebido:', content)
      
      // Fallback com valores padrão
      analysis = {
        calories: 500,
        protein: 25,
        carbs: 60,
        fat: 15,
        foods: ['Não foi possível identificar os alimentos'],
        suggestions: ['Tente tirar uma foto mais clara', 'Certifique-se de que a comida está bem iluminada']
      }
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Erro na análise de comida:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar análise' },
      { status: 500 }
    )
  }
}
