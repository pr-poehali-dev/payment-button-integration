import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LevelData {
  total: number;
  max: number;
  percentage: number;
  income: number;
}

interface MatrixData {
  user: {
    name: string;
    emoji: string;
    totalNetwork: number;
    cakesInWork: number;
    referralLink: string;
  };
  levels: Record<number, LevelData>;
  baker: {
    totalSlots: number;
    soldSlots: number;
    daysUntilIncrease: number;
    price: string;
  };
}

const availableEmojis = [
  '🥷', '🥶', '👾', '😈', '🤯', '🎃', '🪬', '🤑', '🔥', '💰',
  '🤖', '🙈', '😍', '🦊', '🏀', '❤️‍🔥', '❤️', '😱', '💋', '🤪',
  '😈', '👿', '😵‍💫', '😶‍🌫️', '😶', '👻', '💀', '👾', '🤡', '🫀'
];

const Index = () => {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedEmoji, setSelectedEmoji] = useState('🥷');
  const [emojiSelectorOpen, setEmojiSelectorOpen] = useState(false);
  const [currentEmojiPage, setCurrentEmojiPage] = useState(0);
  const [calculatorMode, setCalculatorMode] = useState<'x3' | 'xx'>('x3');
  const [calculatorInput, setCalculatorInput] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [calculatorResults, setCalculatorResults] = useState<any>(null);

  const [matrixData] = useState<MatrixData>({
    user: {
      name: 'DMITRIY',
      emoji: '🥷',
      totalNetwork: 968,
      cakesInWork: 8,
      referralLink: 'https://cake-matrix.com/ref/DMITRIY2024'
    },
    levels: {
      1: { total: 8, max: 10, percentage: 25, income: 75 },
      2: { total: 24, max: 30, percentage: 12.5, income: 113 },
      3: { total: 72, max: 90, percentage: 8.33, income: 225 },
      4: { total: 216, max: 270, percentage: 6.25, income: 506 },
      5: { total: 648, max: 810, percentage: 5, income: 1215 }
    },
    baker: {
      totalSlots: 10000,
      soldSlots: 1458,
      daysUntilIncrease: 15,
      price: '5 TON'
    }
  });

  const emojisPerPage = 24;
  const totalIncome = Object.values(matrixData.levels).reduce((sum, level) => sum + level.income, 0);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(matrixData.user.referralLink);
    toast({
      title: 'Скопировано!',
      description: 'Реферальная ссылка скопирована в буфер обмена'
    });
  };

  const handleBuyBaker = () => {
    toast({
      title: 'Платежная система',
      description: 'Здесь будет интеграция платежной системы для покупки BAKER за 5 TON',
      duration: 5000
    });
  };

  const calculateIncome = () => {
    const userCount = parseInt(calculatorInput) || 0;
    if (userCount === 0) return;

    const multiplier = calculatorMode === 'x3' ? 3 : 10;
    const line1 = userCount;
    const line2 = line1 * multiplier;
    const line3 = line2 * multiplier;
    const line4 = line3 * multiplier;
    const line5 = line4 * multiplier;

    const totalNetwork = line1 + line2 + line3 + line4 + line5;
    const packagePrice = 150;
    const fundPercentage = 0.25;
    const fundPerUser = packagePrice * fundPercentage;

    const incomeLine1 = Math.round(line1 * fundPerUser * 0.25);
    const incomeLine2 = Math.round(line2 * fundPerUser * 0.125);
    const incomeLine3 = Math.round(line3 * fundPerUser * 0.0833);
    const incomeLine4 = Math.round(line4 * fundPerUser * 0.0625);
    const incomeLine5 = Math.round(line5 * fundPerUser * 0.05);

    const totalProfit = incomeLine1 + incomeLine2 + incomeLine3 + incomeLine4 + incomeLine5;

    setCalculatorResults({
      totalNetwork,
      lines: [
        { people: line1, income: incomeLine1 },
        { people: line2, income: incomeLine2 },
        { people: line3, income: incomeLine3 },
        { people: line4, income: incomeLine4 },
        { people: line5, income: incomeLine5 }
      ],
      totalProfit
    });
  };

  const currentLevelData = matrixData.levels[currentLevel];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_300px] gap-5">
          
          {/* LEFT PANEL - PROFILE */}
          <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-black border-purple-500/30 hover-scale">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4 tracking-wider">PROFILE</h2>
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 border border-green-500/40 mb-4">
                <span className="text-sm font-bold">CAKE MATRIX</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div 
                className="text-7xl cursor-pointer transition-transform hover:scale-110 mb-4"
                onClick={() => setEmojiSelectorOpen(!emojiSelectorOpen)}
              >
                {selectedEmoji}
              </div>

              {emojiSelectorOpen && (
                <div className="grid grid-cols-6 gap-2 mb-4 p-4 bg-white/5 rounded-lg">
                  {availableEmojis.slice(
                    currentEmojiPage * emojisPerPage,
                    (currentEmojiPage + 1) * emojisPerPage
                  ).map((emoji, i) => (
                    <div
                      key={i}
                      className="text-2xl cursor-pointer hover:scale-125 transition-transform p-2 hover:bg-white/10 rounded"
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setEmojiSelectorOpen(false);
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              )}

              <h3 
                className="text-xl font-bold cursor-pointer hover:text-purple-400 transition-colors"
                onClick={copyReferralLink}
                title="Кликните, чтобы скопировать реферальную ссылку"
              >
                {matrixData.user.name} 🔗
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              {[1, 2, 3, 4, 5].map((level) => {
                const data = matrixData.levels[level];
                return (
                  <div
                    key={level}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                        level === 1 ? 'bg-green-500/40' :
                        level === 2 ? 'bg-orange-500/40' :
                        level === 3 ? 'bg-red-500/40' :
                        level === 4 ? 'bg-purple-500/40' : 'bg-pink-500/40'
                      }`}>
                        {level}
                      </div>
                      <div>
                        <div className="font-bold text-sm">LEVEL {level}</div>
                        <div className="text-xs text-gray-400">{data.total}/{data.max} чел • {data.percentage}%</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">{data.income} ₽</div>
                      <div className="text-xs text-gray-400">доход</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-orange-400 mb-1">{matrixData.user.cakesInWork}</div>
              <div className="text-sm text-gray-400">CAKE</div>
            </div>
          </Card>

          {/* CENTER PANEL - CAKE MATRIX */}
          <Card className="p-6 bg-gradient-to-br from-green-900/20 to-black border-green-500/30">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎂 CAKE MATRIX</h2>
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 border border-green-500/40">
                <span className="text-sm font-bold">STANDART</span>
              </div>
            </div>

            <div className="relative h-96 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-black/60 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <div className="text-xl text-green-400 font-bold mb-2">LEVEL {currentLevel}</div>
                  <div className="text-gray-300 mb-2">{currentLevelData.total}/{currentLevelData.max} человек</div>
                  <div className="text-2xl text-orange-400 font-bold">{currentLevelData.income} ₽</div>
                </div>
              </div>

              <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                {Array.from({ length: 10 }).map((_, i) => {
                  const angle = (i / 10) * 2 * Math.PI;
                  const x = 175 * Math.cos(angle);
                  const y = 175 * Math.sin(angle);
                  return (
                    <div
                      key={i}
                      className="absolute text-3xl cursor-pointer hover:scale-150 transition-transform"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%) rotate(-' + (360 * (i / 10)) + 'deg)'
                      }}
                    >
                      {availableEmojis[i % 10]}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {[1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  onClick={() => setCurrentLevel(level)}
                  variant={currentLevel === level ? 'default' : 'outline'}
                  className={`flex-1 ${currentLevel === level ? 'bg-green-500/30 border-green-500' : ''}`}
                >
                  LEVEL {level}
                </Button>
              ))}
            </div>

            <div 
              className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/10 border border-green-500/30 text-center cursor-pointer hover:scale-105 transition-transform mb-6"
              onClick={() => setShowIncomeModal(true)}
            >
              <div className="text-3xl font-bold text-green-400 mb-2">{totalIncome.toLocaleString()} ₽</div>
              <div className="text-sm text-gray-400">Общая прибыль</div>
            </div>

            <Button
              onClick={() => setShowCalculator(true)}
              className="w-full h-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/50 hover:from-purple-800/60 hover:to-blue-800/60 text-lg font-bold relative overflow-hidden group"
            >
              <span className="relative z-10">CALCULATOR XIII & XX</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </Card>

          {/* RIGHT PANEL - BAKER */}
          <Card className="p-6 bg-gradient-to-br from-orange-900/20 to-black border-orange-500/30">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">🍞 BAKER</h2>
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-500/40">
                <span className="text-sm font-bold">PREMIUM</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-orange-400 mb-2">{matrixData.baker.price}</div>
              <div className="text-sm text-gray-400">+10 реферальных слотов</div>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center mb-4">
              <div className="text-xl font-bold text-orange-400 mb-1">
                {(matrixData.baker.totalSlots - matrixData.baker.soldSlots).toLocaleString()}/{matrixData.baker.totalSlots.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Осталось слотов по 5 TON</div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center mb-6">
              <div className="text-sm font-bold text-red-400">
                ⏰ До повышения: {matrixData.baker.daysUntilIncrease} дней
              </div>
            </div>

            <Button
              onClick={handleBuyBaker}
              className="w-full h-14 bg-gradient-to-r from-orange-500/40 to-red-500/30 hover:from-orange-500/50 hover:to-red-500/40 border border-orange-500/50 text-lg font-bold mb-6"
            >
              КУПИТЬ BAKER
            </Button>

            <div className="space-y-3 text-sm text-gray-400">
              {[
                '✅ +10 реферальных слотов',
                '✅ +30% за приглашенного пользователя',
                '✅ 10-ый CAKE бесплатный',
                '💰 Доход со 2-5 линий',
                '🚀 Приоритет в сети',
                '🔄 Можно докупать повторно',
                `📈 Уже купили: ${matrixData.baker.soldSlots} человек`
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                  {feature}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* CALCULATOR MODAL */}
      {showCalculator && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setShowCalculator(false)}
        >
          <Card 
            className="w-full max-w-md bg-gradient-to-br from-purple-900/40 to-black border-purple-500/30 p-6 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCalculator(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CALCULATOR XIII & XX
            </h2>

            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setCalculatorMode('x3')}
                variant={calculatorMode === 'x3' ? 'default' : 'outline'}
                className="flex-1"
              >
                CALCULATOR XIII
              </Button>
              <Button
                onClick={() => setCalculatorMode('xx')}
                variant={calculatorMode === 'xx' ? 'default' : 'outline'}
                className="flex-1"
              >
                CALCULATOR XX
              </Button>
            </div>

            <p className="text-sm text-center text-gray-400 mb-6">
              {calculatorMode === 'x3' 
                ? 'Каждый участник приглашает до 3 человек'
                : 'Каждый участник приглашает до 10 человек'}
            </p>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2 text-center">
                Сколько пользователей приведете?
              </label>
              <input
                type="number"
                value={calculatorInput}
                onChange={(e) => setCalculatorInput(e.target.value)}
                className="w-full p-4 bg-white/10 border border-purple-500/40 rounded-xl text-center text-white placeholder-gray-500"
                placeholder="Введите число"
                min="0"
              />
            </div>

            <Button
              onClick={calculateIncome}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-bold mb-6"
            >
              РАССЧИТАТЬ ДОХОД
            </Button>

            {calculatorResults && (
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold text-green-400 mb-4">РЕЗУЛЬТАТ РАСЧЕТА</h3>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Всего в сети:</span>
                    <span className="text-orange-400 font-bold">{calculatorResults.totalNetwork.toLocaleString()} человек</span>
                  </div>
                  {calculatorResults.lines.map((line: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-400">Линия {i + 1}:</span>
                      <span className="text-orange-400 font-bold">
                        {line.people.toLocaleString()} чел = {line.income.toLocaleString()} ₽
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-6 border-t border-white/10">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {calculatorResults.totalProfit.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-400 uppercase">общая прибыль</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* INCOME MODAL */}
      {showIncomeModal && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setShowIncomeModal(false)}
        >
          <Card 
            className="w-full max-w-md bg-gradient-to-br from-green-900/40 to-black border-green-500/30 p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIncomeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-2xl"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{matrixData.user.name}</h2>
              <p className="text-sm text-gray-400">Всего в сети: {matrixData.user.totalNetwork} человек</p>
            </div>

            <div className="space-y-3 mb-6">
              {[1, 2, 3, 4, 5].map((level) => {
                const data = matrixData.levels[level];
                return (
                  <div
                    key={level}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white ${
                        level === 1 ? 'bg-green-500/40' :
                        level === 2 ? 'bg-orange-500/40' :
                        level === 3 ? 'bg-red-500/40' :
                        level === 4 ? 'bg-purple-500/40' : 'bg-pink-500/40'
                      }`}>
                        {level}
                      </div>
                      <div>
                        <div className="font-bold">LEVEL {level}</div>
                        <div className="text-sm text-gray-400">{data.total}/{data.max} человек</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400 text-lg">{data.income} ₽</div>
                      <div className="text-xs text-gray-400">доход</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/10 border border-green-500/30 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{totalIncome.toLocaleString()} ₽</div>
              <div className="text-sm text-gray-400">Общая прибыль</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
