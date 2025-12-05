import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type StatusLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

interface Referral {
  id: string;
  name: string;
  earned: number;
  status: StatusLevel;
  joinDate: string;
}

const statusConfig = {
  bronze: { color: '#CD7F32', name: 'Bronze', minReferrals: 0 },
  silver: { color: '#C0C0C0', name: 'Silver', minReferrals: 5 },
  gold: { color: '#FFD700', name: 'Gold', minReferrals: 15 },
  platinum: { color: '#E5E4E2', name: 'Platinum', minReferrals: 30 }
};

const Index = () => {
  const { toast } = useToast();
  const [referrals] = useState<Referral[]>([
    { id: '1', name: 'Алексей М.', earned: 1250, status: 'gold', joinDate: '15.11.2024' },
    { id: '2', name: 'Мария К.', earned: 890, status: 'silver', joinDate: '20.11.2024' },
    { id: '3', name: 'Дмитрий П.', earned: 2100, status: 'platinum', joinDate: '05.11.2024' },
    { id: '4', name: 'Елена С.', earned: 450, status: 'bronze', joinDate: '28.11.2024' },
    { id: '5', name: 'Иван Р.', earned: 1680, status: 'gold', joinDate: '10.11.2024' }
  ]);

  const totalEarned = referrals.reduce((sum, ref) => sum + ref.earned, 0);
  const referralCount = referrals.length;
  const referralLink = 'https://your-platform.com/ref/YOUR_CODE';

  const getCurrentStatus = (): StatusLevel => {
    if (referralCount >= 30) return 'platinum';
    if (referralCount >= 15) return 'gold';
    if (referralCount >= 5) return 'silver';
    return 'bronze';
  };

  const getNextStatus = () => {
    const current = getCurrentStatus();
    if (current === 'bronze') return { level: 'silver', needed: 5 - referralCount };
    if (current === 'silver') return { level: 'gold', needed: 15 - referralCount };
    if (current === 'gold') return { level: 'platinum', needed: 30 - referralCount };
    return null;
  };

  const getProgressPercentage = () => {
    if (referralCount >= 30) return 100;
    if (referralCount >= 15) return 75;
    if (referralCount >= 5) return 50;
    return (referralCount / 5) * 25;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Скопировано!',
      description: 'Реферальная ссылка скопирована в буфер обмена',
    });
  };

  const handlePayment = () => {
    toast({
      title: 'Платежная система',
      description: 'Здесь будет ваш код платежной системы',
    });
  };

  const currentStatus = getCurrentStatus();
  const nextStatus = getNextStatus();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Реферальная программа</h1>
            <p className="text-muted-foreground mt-2">Зарабатывайте с каждого приглашенного пользователя</p>
          </div>
          <Button onClick={handlePayment} size="lg" className="bg-accent hover:bg-accent/90 gap-2">
            <Icon name="CreditCard" size={20} />
            Вывести средства
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover-scale animate-fade-in bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Icon name="Wallet" size={32} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Общий заработок</p>
                <p className="text-3xl font-bold text-foreground">${totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-scale animate-fade-in bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Icon name="Users" size={32} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Рефералов</p>
                <p className="text-3xl font-bold text-foreground">{referralCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-scale animate-fade-in bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${statusConfig[currentStatus].color}20` }}>
                <Icon name="Award" size={32} style={{ color: statusConfig[currentStatus].color }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Текущий статус</p>
                <p className="text-3xl font-bold text-foreground">{statusConfig[currentStatus].name}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 animate-fade-in bg-card border-border">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-foreground">Прогресс статуса</h2>
                {nextStatus && (
                  <Badge variant="outline" className="text-sm">
                    До {statusConfig[nextStatus.level as StatusLevel].name}: еще {nextStatus.needed} {nextStatus.needed === 1 ? 'реферал' : 'рефералов'}
                  </Badge>
                )}
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(statusConfig) as StatusLevel[]).map((level) => {
                const config = statusConfig[level];
                const isActive = referralCount >= config.minReferrals;
                return (
                  <div
                    key={level}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <Icon
                        name="Award"
                        size={32}
                        style={{ color: isActive ? config.color : '#4a5568' }}
                      />
                      <div>
                        <p className="font-semibold text-foreground">{config.name}</p>
                        <p className="text-xs text-muted-foreground">{config.minReferrals}+ рефералов</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="p-8 animate-fade-in bg-card border-border">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Ваша реферальная ссылка</h2>
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-muted rounded-lg border border-border">
              <p className="text-foreground font-mono break-all">{referralLink}</p>
            </div>
            <Button onClick={copyReferralLink} className="gap-2">
              <Icon name="Copy" size={20} />
              Копировать
            </Button>
          </div>
        </Card>

        <Card className="p-8 animate-fade-in bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Ваши рефералы</h2>
            <Badge variant="secondary" className="text-sm">
              {referrals.length} активных
            </Badge>
          </div>
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">Присоединился {referral.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${referral.earned}</p>
                    <p className="text-xs text-muted-foreground">заработано</p>
                  </div>
                  <Badge
                    style={{
                      backgroundColor: `${statusConfig[referral.status].color}20`,
                      color: statusConfig[referral.status].color,
                      borderColor: statusConfig[referral.status].color
                    }}
                    className="border"
                  >
                    {statusConfig[referral.status].name}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
