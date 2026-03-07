'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { Volume2, Copy, Check, Heart } from 'lucide-react';

interface Dua {
  id: string;
  title: string;
  category: string;
  arabicText: string;
  transliteration: string;
  translation: string;
}

const categoryIcons: Record<string, string> = {
  morning: '🌅',
  eating: '🍽️',
  sleeping: '🌙',
  travel: '🚗',
  home: '🏠',
  bathroom: '🚿',
  mosque: '🕌',
  protection: '🛡️',
};

const categoryLabels: Record<string, string> = {
  morning: 'Morning',
  eating: 'Eating',
  sleeping: 'Sleeping',
  travel: 'Travel',
  home: 'Home',
  bathroom: 'Bathroom',
  mosque: 'Mosque',
  protection: 'Protection',
};

export default function DuaCard() {
  const { cachedDuas, setCachedDuas, isOffline } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<string>('morning');
  const [activeDuaIndex, setActiveDuaIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = Object.keys(cachedDuas);
  const currentDuas = cachedDuas[activeCategory] || [];
  const currentDua = currentDuas[activeDuaIndex];

  useEffect(() => {
    async function fetchDuas() {
      try {
        const res = await fetch('/api/duas');
        if (res.ok) {
          const data = await res.json();
          setCachedDuas(data);
          // Set first category as active
          const cats = Object.keys(data);
          if (cats.length > 0) {
            setActiveCategory(cats[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching duas:', error);
      } finally {
        setLoading(false);
      }
    }

    if (Object.keys(cachedDuas).length === 0) {
      fetchDuas();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setActiveDuaIndex(0);
  }, [activeCategory]);

  const handleCopy = async () => {
    if (!currentDua) return;
    
    const text = `${currentDua.title}\n\n${currentDua.arabicText}\n\n${currentDua.transliteration}\n\n${currentDua.translation}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = () => {
    if (!currentDua) return;
    
    setFavorites((prev) =>
      prev.includes(currentDua.id)
        ? prev.filter((id) => id !== currentDua.id)
        : [...prev, currentDua.id]
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-1/2 mx-auto" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-gray-500">
          No duas available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="overflow-x-auto scrollbar-thin pb-2">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              className={`flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#1B5E20] hover:bg-[#2E7D32]'
                  : 'border-gray-300'
              }`}
            >
              <span className="mr-1">{categoryIcons[cat] || '📖'}</span>
              {categoryLabels[cat] || cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Offline Indicator */}
      {isOffline && (
        <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
          📴 Offline Mode
        </div>
      )}

      {/* Dua Card */}
      {currentDua && (
        <Card className="w-full overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#FFD54F] pb-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-white/30 text-amber-900 border-0">
                {categoryIcons[activeCategory]} {categoryLabels[activeCategory]}
              </Badge>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleFavorite}
                  className={`text-amber-900 hover:bg-white/20 ${
                    favorites.includes(currentDua.id) ? 'text-red-500' : ''
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(currentDua.id) ? 'fill-current' : ''
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-amber-900 hover:bg-white/20"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="text-amber-900 hover:bg-white/20"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <CardTitle className="text-xl text-amber-900 mt-2">
              {currentDua.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Arabic Text */}
            <div className="text-center bg-green-50 rounded-xl p-6">
              <p
                className="text-2xl leading-loose text-[#1B5E20]"
                dir="rtl"
                style={{ fontFamily: 'Amiri, Traditional Arabic, serif' }}
              >
                {currentDua.arabicText}
              </p>
            </div>

            {/* Transliteration */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Transliteration:</p>
              <p className="text-[#1B5E20] italic text-lg">
                {currentDua.transliteration}
              </p>
            </div>

            {/* Translation */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Translation:</p>
              <p className="text-gray-700 leading-relaxed">
                {currentDua.translation}
              </p>
            </div>
          </CardContent>

          {/* Navigation */}
          {currentDuas.length > 1 && (
            <div className="flex justify-center gap-2 pb-4">
              {currentDuas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDuaIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeDuaIndex
                      ? 'w-6 bg-[#D4AF37]'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
