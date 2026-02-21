'use client';

import React, { useState } from 'react';
import { DATE_IDEAS, DateBudget, DateVibe, DateIdea } from '@/data/date-ideas';
import { Wallet, Coins, Gem, Heart, Smile, Coffee, Mountain, Sparkles, RefreshCcw, Share2 } from 'lucide-react';

export interface GeneratorDict {
    title: string;
    subtitle: string;
    budget: string;
    vibe: string;
    generateBtn: string;
    generatingBtn: string;
    tryAgainBtn: string;
    budget_free: string;
    budget_cheap: string;
    budget_splurge: string;
    vibe_romantic: string;
    vibe_fun: string;
    vibe_cozy: string;
    vibe_adventurous: string;
    any: string;
    resultTitle: string;
}

interface DateIdeaGeneratorProps {
    dict: GeneratorDict;
    locale: 'en' | 'zh';
}

const BudgetOption = ({ value, icon: Icon, label, selected, onSelect }: { value: DateBudget | 'any', icon: React.ElementType, label: string, selected: boolean, onSelect: (val: DateBudget | 'any') => void }) => {
    return (
        <button
            onClick={() => onSelect(value)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ease-in-out ${selected
                ? 'border-black bg-black text-white shadow-md transform scale-105'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
        >
            <div className="flex items-center space-x-2">
                <Icon className={`w-5 h-5 ${selected ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-semibold text-sm md:text-base">{label}</span>
            </div>
        </button>
    );
};

const VibeOption = ({ value, icon: Icon, label, selected, onSelect }: { value: DateVibe | 'any', icon: React.ElementType, label: string, selected: boolean, onSelect: (val: DateVibe | 'any') => void }) => {
    return (
        <button
            onClick={() => onSelect(value)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ease-in-out ${selected
                ? 'border-pink-500 bg-pink-500 text-white shadow-md transform scale-105'
                : 'border-gray-200 bg-white text-gray-600 hover:border-pink-200 hover:bg-pink-50'
                }`}
        >
            <Icon className={`w-8 h-8 mb-2 ${selected ? 'text-white' : 'text-pink-400'}`} />
            <span className="font-semibold text-sm md:text-base">{label}</span>
        </button>
    );
};

export function DateIdeaGenerator({ dict, locale }: DateIdeaGeneratorProps) {

    const [budget, setBudget] = useState<DateBudget | 'any'>('any');
    const [vibe, setVibe] = useState<DateVibe | 'any'>('any');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<DateIdea | null>(null);

    const handleGenerate = () => {
        setIsGenerating(true);
        setResult(null);

        // Filter ideas
        let filtered = DATE_IDEAS;
        if (budget !== 'any') {
            filtered = filtered.filter((idea) => idea.budget === budget);
        }
        if (vibe !== 'any') {
            filtered = filtered.filter((idea) => idea.vibe === vibe);
        }

        // Fallback if empty (should never happen with current data, but safe)
        if (filtered.length === 0) {
            filtered = DATE_IDEAS;
        }

        // Pick random
        const randomIdea = filtered[Math.floor(Math.random() * filtered.length)];

        // Simulate loading for effect
        setTimeout(() => {
            setResult(randomIdea);
            setIsGenerating(false);
        }, 1200);
    };

    const handleShare = async () => {
        if (!result) return;
        const title = result.title[locale];
        const text = result.description[locale];
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {dict.title}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {dict.subtitle}
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 md:p-12">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column: Selections */}
                        <div className={`space-y-8 transition-opacity duration-500 ${result ? 'opacity-50 pointer-events-none hidden md:block' : 'opacity-100'}`}>

                            {/* Budget */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="bg-gray-100 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                                    {dict.budget}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <BudgetOption value="any" icon={Sparkles} label={dict.any} selected={budget === 'any'} onSelect={setBudget} />
                                    <BudgetOption value="free" icon={Wallet} label={dict.budget_free} selected={budget === 'free'} onSelect={setBudget} />
                                    <BudgetOption value="cheap" icon={Coins} label={dict.budget_cheap} selected={budget === 'cheap'} onSelect={setBudget} />
                                    <BudgetOption value="splurge" icon={Gem} label={dict.budget_splurge} selected={budget === 'splurge'} onSelect={setBudget} />
                                </div>
                            </div>

                            {/* Vibe */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                                    {dict.vibe}
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    <VibeOption value="any" icon={Sparkles} label={dict.any} selected={vibe === 'any'} onSelect={setVibe} />
                                    <VibeOption value="romantic" icon={Heart} label={dict.vibe_romantic} selected={vibe === 'romantic'} onSelect={setVibe} />
                                    <VibeOption value="fun" icon={Smile} label={dict.vibe_fun} selected={vibe === 'fun'} onSelect={setVibe} />
                                    <VibeOption value="cozy" icon={Coffee} label={dict.vibe_cozy} selected={vibe === 'cozy'} onSelect={setVibe} />
                                    <VibeOption value="adventurous" icon={Mountain} label={dict.vibe_adventurous} selected={vibe === 'adventurous'} onSelect={setVibe} />
                                </div>
                            </div>

                        </div>

                        {/* Right Column: CTA or Result */}
                        <div className="flex flex-col justify-center min-h-[400px]">
                            {!result && !isGenerating && (
                                <div className="text-center h-full flex flex-col items-center justify-center space-y-6 bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-2">
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                    <button
                                        onClick={handleGenerate}
                                        className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                                    >
                                        {dict.generateBtn}
                                    </button>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="text-center h-full flex flex-col items-center justify-center space-y-6">
                                    <div className="relative w-24 h-24">
                                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-pink-500">
                                            <Heart className="w-8 h-8 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold text-gray-600 animate-pulse">{dict.generatingBtn}</p>
                                </div>
                            )}

                            {result && !isGenerating && (
                                <div className="h-full flex flex-col bg-white rounded-2xl p-1 shadow-2xl ring-1 ring-gray-900/5 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-xl flex-grow flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-pink-200 rounded-full opacity-50 blur-2xl"></div>
                                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>

                                        <div className="relative z-10 text-center">
                                            <span className="inline-block px-3 py-1 bg-white text-xs font-bold tracking-wider text-pink-600 rounded-full mb-6 shadow-sm uppercase">
                                                {dict.resultTitle}
                                            </span>
                                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                                                {result.title[locale]}
                                            </h2>
                                            <p className="text-lg text-gray-700 leading-relaxed">
                                                {result.description[locale]}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row gap-3 pt-2">
                                        <button
                                            onClick={handleGenerate}
                                            className="flex-1 py-3 px-4 bg-black text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
                                        >
                                            <RefreshCcw className="w-5 h-5" />
                                            <span>{dict.tryAgainBtn}</span>
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="py-3 px-6 bg-gray-100 text-gray-900 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Reset view on mobile if result is shown */}
                                    <div className="mt-4 md:hidden">
                                        <button onClick={() => setResult(null)} className="w-full py-2 text-sm text-gray-500 underline">
                                            Change Selections
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
