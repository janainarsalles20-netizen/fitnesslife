'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular verificação do pagamento
    setTimeout(() => setLoading(false), 2000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Confirmando seu pagamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Pagamento Confirmado!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Bem-vindo ao FitnessLife Premium! Seu acesso foi liberado.
        </p>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Agora você tem acesso a:
          </h2>
          <ul className="text-left space-y-3 max-w-md mx-auto">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">120 receitas personalizadas</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">20 treinos profissionais</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Guias completos de bem-estar</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Atualizações mensais</span>
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
        >
          Começar Agora
        </Link>

        {sessionId && (
          <p className="text-sm text-gray-500 mt-6">
            ID da sessão: {sessionId}
          </p>
        )}
      </div>
    </div>
  )
}