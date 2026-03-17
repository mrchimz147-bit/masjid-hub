'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, Volume2, Droplets, Prayer } from 'lucide-react';

interface GuideStep {
  id: string;
  category: string;
  stepNumber: number;
  title: string;
  arabicText: string | null;
  transliteration: string | null;
  translation: string | null;
}

export default function GuideCarousel() {
  const { cachedGuides, setCachedGuides, isOffline } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<'wudu' | 'salah'>('wudu');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const steps = cachedGuides[activeCategory] || [];

  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await fetch('/api/guides');
        if (res.ok) {
          const data = await res.json();
          setCachedGuides(data);
        }
      } catch (error) {
        console.error('Error fetching guides:', error);
      } finally {
        setLoading(false);
      }
    }

    if (cachedGuides.wudu.length === 0 && cachedGuides.salah.length === 0) {
      fetchGuides();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentStep(0);
  }, [activeCategory]);

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-1/2 mx-auto" />
            <div className="h-32 bg-gray-100 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (steps.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-gray-500">
          No guides available
        </CardContent>
      </Card>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-4">
      {/* Category Toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveCategory('wudu')}
          variant={activeCategory === 'wudu' ? 'default' : 'outline'}
          className={`flex-1 ${
            activeCategory === 'wudu'
              ? 'bg-[#1B5E20] hover:bg-[#2E7D32]'
              : 'border-[#1B5E20] text-[#1B5E20]'
          }`}
        >
          <Droplets className="w-4 h-4 mr-2" />
          Wudu Guide
        </Button>
        <Button
          onClick={() => setActiveCategory('salah')}
          variant={activeCategory === 'salah' ? 'default' : 'outline'}
          className={`flex-1 ${
            activeCategory === 'salah'
              ? 'bg-[#1B5E20] hover:bg-[#2E7D32]'
              : 'border-[#1B5E20] text-[#1B5E20]'
          }`}
        >
          <Prayer className="w-4 h-4 mr-2" />
          Salah Guide
        </Button>
      </div>

      {/* Offline Indicator */}
      {isOffline && (
        <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
          📴 Offline Mode
        </div>
      )}

      {/* Step Counter */}
      <div className="flex justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'w-6 bg-[#1B5E20]'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Guide Card */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white pb-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-white/20 text-white border-0">
              Step {currentStepData.stepNumber} of {steps.length}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-xl mt-2">{currentStepData.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Arabic Text */}
          {currentStepData.arabicText && (
            <div className="text-center">
              <p className="text-3xl leading-loose text-[#1B5E20] font-arabic" dir="rtl">
                {currentStepData.arabicText}
              </p>
            </div>
          )}

          {/* Transliteration */}
          {currentStepData.transliteration && (
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Transliteration:</p>
              <p className="text-lg text-[#1B5E20] italic">
                {currentStepData.transliteration}
              </p>
            </div>
          )}

          {/* Translation */}
          {currentStepData.translation && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Translation:</p>
              <p className="text-gray-700 leading-relaxed">
                {currentStepData.translation}
              </p>
            </div>
          )}
        </CardContent>

        {/* Navigation */}
        <div className="flex border-t">
          <Button
            onClick={handlePrev}
            variant="ghost"
            className="flex-1 rounded-none py-4 border-r hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            variant="ghost"
            className="flex-1 rounded-none py-4 hover:bg-gray-50"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Import Badge
import { Badge } from '@/components/ui/badge';
