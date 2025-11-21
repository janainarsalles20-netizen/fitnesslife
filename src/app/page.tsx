'use client'

import { useState } from 'react'
import { Heart, Home, Flame, Clock, Star, ChevronRight, Play, CheckCircle2, User, Calendar, ArrowUp, Info, Plus, Minus, X, Circle, Utensils, Dumbbell, Sparkles, Droplet, Lock, Check, CreditCard, Zap, Loader2, AlertCircle } from 'lucide-react'

type Tab = 'quiz' | 'plans'
type GoalType = 'lose' | 'maintain' | 'gain'

interface Recipe {
  id: number
  title: string
  calories: number
  time: string
  ingredients: string[]
  instructions: string[]
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  goal: GoalType
}

interface Workout {
  id: number
  title: string
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  location: 'gym' | 'home'
  exercises: { name: string; reps: string }[]
  goal: GoalType
}

interface HeightTip {
  id: number
  title: string
  description: string
  category: 'exercise' | 'nutrition' | 'sleep' | 'posture' | 'lifestyle'
}

interface AppearanceTip {
  id: number
  title: string
  description: string
  category: 'haircut' | 'style' | 'grooming' | 'facial-hair'
  trend: string
}

interface SkincareTip {
  id: number
  title: string
  description: string
  steps: string[]
  skinType: 'all' | 'oily' | 'dry' | 'combination'
}

interface QuizQuestion {
  id: number
  question: string
  options: { value: string; label: string }[]
  category: 'goal' | 'skin' | 'workout' | 'height'
}

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState<Tab>('quiz')
  const [isPremium, setIsPremium] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const [userGoal, setUserGoal] = useState<GoalType>('lose')
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Qual é o seu objetivo principal?',
      category: 'goal',
      options: [
        { value: 'lose', label: 'Perder peso e emagrecer' },
        { value: 'maintain', label: 'Manter minha massa atual' },
        { value: 'gain', label: 'Ganhar massa muscular' }
      ]
    },
    {
      id: 2,
      question: 'Qual é o seu tipo de pele?',
      category: 'skin',
      options: [
        { value: 'oily', label: 'Oleosa' },
        { value: 'dry', label: 'Seca' },
        { value: 'combination', label: 'Mista' },
        { value: 'normal', label: 'Normal' }
      ]
    },
    {
      id: 3,
      question: 'Onde você prefere treinar?',
      category: 'workout',
      options: [
        { value: 'gym', label: 'Academia' },
        { value: 'home', label: 'Em casa' },
        { value: 'both', label: 'Ambos' }
      ]
    },
    {
      id: 4,
      question: 'Qual é o seu nível de condicionamento?',
      category: 'workout',
      options: [
        { value: 'beginner', label: 'Iniciante' },
        { value: 'intermediate', label: 'Intermediário' },
        { value: 'advanced', label: 'Avançado' }
      ]
    },
    {
      id: 5,
      question: 'Você tem interesse em aumentar sua altura?',
      category: 'height',
      options: [
        { value: 'yes', label: 'Sim, muito interesse' },
        { value: 'maybe', label: 'Talvez, quero saber mais' },
        { value: 'no', label: 'Não é prioridade' }
      ]
    },
    {
      id: 6,
      question: 'Quantas vezes por semana você pode treinar?',
      category: 'workout',
      options: [
        { value: '1-2', label: '1-2 vezes' },
        { value: '3-4', label: '3-4 vezes' },
        { value: '5-6', label: '5-6 vezes' },
        { value: '7', label: 'Todos os dias' }
      ]
    },
    {
      id: 7,
      question: 'Qual é a sua principal dificuldade com alimentação?',
      category: 'goal',
      options: [
        { value: 'time', label: 'Falta de tempo para cozinhar' },
        { value: 'knowledge', label: 'Não sei o que comer' },
        { value: 'discipline', label: 'Falta de disciplina' },
        { value: 'variety', label: 'Falta de variedade' }
      ]
    },
    {
      id: 8,
      question: 'Você tem alguma restrição alimentar?',
      category: 'goal',
      options: [
        { value: 'none', label: 'Nenhuma' },
        { value: 'vegetarian', label: 'Vegetariano' },
        { value: 'vegan', label: 'Vegano' },
        { value: 'lactose', label: 'Intolerância à lactose' },
        { value: 'gluten', label: 'Intolerância ao glúten' }
      ]
    },
    {
      id: 9,
      question: 'Quanto tempo você tem disponível para treinar?',
      category: 'workout',
      options: [
        { value: '15-30', label: '15-30 minutos' },
        { value: '30-45', label: '30-45 minutos' },
        { value: '45-60', label: '45-60 minutos' },
        { value: '60+', label: 'Mais de 1 hora' }
      ]
    },
    {
      id: 10,
      question: 'Qual é a sua prioridade no momento?',
      category: 'goal',
      options: [
        { value: 'weight', label: 'Perder/ganhar peso' },
        { value: 'strength', label: 'Ganhar força' },
        { value: 'endurance', label: 'Melhorar resistência' },
        { value: 'appearance', label: 'Melhorar aparência geral' },
        { value: 'health', label: 'Saúde e bem-estar' }
      ]
    }
  ]

  const plans = [
    { id: 'weekly', name: 'Semanal', price: 19.99, period: '/semana', popular: false },
    { id: 'monthly', name: 'Mensal', price: 49.99, period: '/mês', popular: true },
    { id: 'yearly', name: 'Anual', price: 299.99, period: '/ano', popular: false, savings: 'Economize 50%' }
  ]

  const handleQuizAnswer = (questionId: number, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }))
    
    if (questionId === 1) {
      setUserGoal(value as GoalType)
    }
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1)
    } else {
      setShowQuizResults(true)
      setActiveTab('plans')
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizAnswers({})
    setShowQuizResults(false)
    setActiveTab('quiz')
  }

  const handleSubscribe = async () => {
    setIsProcessingPayment(true)
    setPaymentError(null)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: selectedPlan }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        // Tratamento especial para Stripe não configurado
        if (data.code === 'STRIPE_NOT_CONFIGURED') {
          setPaymentError('⚠️ Sistema de pagamentos em configuração. Por favor, aguarde ou entre em contato com o suporte.')
        } else {
          setPaymentError(data.error || 'Erro ao processar pagamento. Tente novamente.')
        }
        setIsProcessingPayment(false)
        return
      }

      // Redirecionar para checkout do Stripe
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erro:', error)
      setPaymentError('Erro de conexão. Verifique sua internet e tente novamente.')
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FitnessLife
                </h1>
                <p className="text-xs text-gray-600">Seu plano personalizado completo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isPremium && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Premium</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Tab */}
        {activeTab === 'quiz' && !showQuizResults && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Quiz Personalizado Gratuito</h2>
                  <span className="text-sm text-gray-500">
                    {quizStep + 1} de {quizQuestions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {quizQuestions[quizStep].question}
                </h3>
                <div className="space-y-3">
                  {quizQuestions[quizStep].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuizAnswer(quizQuestions[quizStep].id, option.value)}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                    >
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-8">
            {showQuizResults && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
                <h2 className="text-3xl font-bold mb-4">🎉 Quiz Completo!</h2>
                <p className="text-purple-100 text-lg">
                  Preparamos um plano personalizado perfeito para você. Escolha seu plano e desbloqueie todo o conteúdo!
                </p>
              </div>
            )}

            {/* Payment Error Alert */}
            {paymentError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 max-w-3xl mx-auto">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-2">Erro no Pagamento</h3>
                    <p className="text-red-700">{paymentError}</p>
                    <button
                      onClick={() => setPaymentError(null)}
                      className="mt-4 text-red-600 hover:text-red-700 font-medium underline"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Escolha Seu Plano</h2>
              <p className="text-xl text-gray-600">Acesse 120 receitas, 20 treinos e muito mais!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id as any)}
                  className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-purple-500 bg-purple-50 shadow-2xl scale-105'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </div>
                  )}
                  {plan.savings && (
                    <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {plan.savings}
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-gray-900">R$ {plan.price}</span>
                      <span className="text-gray-600 text-lg">{plan.period}</span>
                    </div>
                    <div className={`w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {selectedPlan === plan.id && <Check className="w-7 h-7 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-purple-600" />
                O que você ganha com o Premium:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  '120 receitas personalizadas por objetivo',
                  '20 treinos profissionais completos',
                  'Quiz personalizado com recomendações',
                  '15 dicas para aumentar altura',
                  '12 dicas modernas de aparência e estilo',
                  'Guia completo de cortes e barba 2024',
                  'Rotinas de skincare masculino',
                  'Atualizações mensais de conteúdo'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleSubscribe}
                disabled={isProcessingPayment}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-7 h-7 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-7 h-7" />
                    Assinar Agora - R$ {plans.find(p => p.id === selectedPlan)?.price}
                  </>
                )}
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Pagamento seguro via Stripe • Cancele quando quiser • Garantia de 7 dias
              </p>
            </div>

            {showQuizResults && (
              <div className="text-center">
                <button
                  onClick={resetQuiz}
                  className="text-purple-600 hover:text-purple-700 font-medium underline"
                >
                  Refazer Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              FitnessLife - Transforme sua vida com planos personalizados 💜
            </p>
            <p className="text-gray-500 text-xs mt-2">
              120 Receitas • 20 Treinos • Guias Completos de Bem-Estar
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
