
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { PlanningTerm } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function HomePageClient({ terms }: { terms: PlanningTerm[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>('A');
  const [selectedTerm, setSelectedTerm] = useState<PlanningTerm | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTextRef = useRef<HTMLSpanElement>(null);
  const [clearButtonPosition, setClearButtonPosition] = useState({ left: '50%' });

  useEffect(() => {
    if (searchTextRef.current && searchInputRef.current) {
        const textWidth = searchTextRef.current.offsetWidth;
        const inputWidth = searchInputRef.current.offsetWidth;
        const newLeft = (inputWidth / 2) + (textWidth / 2) + 8;
        setClearButtonPosition({ left: `${newLeft}px` });
    } else {
        setClearButtonPosition({ left: '50%' });
    }
  }, [searchTerm]);
  
  const categories = useMemo(() => {
    const allCategories = terms.map(term => term.category).filter(Boolean) as string[];
    return Array.from(new Set(allCategories)).sort();
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
        const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? term.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      });
    }, [terms, searchTerm, selectedCategory]);

  const groupedTerms = useMemo(() => {
    const groups = terms.reduce((acc, term) => {
      const firstLetter = term.term[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(term);
      return acc;
    }, {} as Record<string, PlanningTerm[]>);

    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter) => {
      if (!groups[letter]) {
        groups[letter] = [];
      }
    });

    return groups;
  }, [terms]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const termsToDisplay = useMemo(() => {
    if (searchTerm || selectedCategory) {
      return filteredTerms;
    }
    if (selectedLetter === 'ALL') {
      return terms;
    }
    if (selectedLetter) {
      return groupedTerms[selectedLetter] || [];
    }
    return [];
  }, [searchTerm, selectedLetter, selectedCategory, filteredTerms, groupedTerms, terms]);

  const handleLetterClick = (letter: string) => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedLetter(letter);
  };

  const handleCategoryClick = (category: string | null) => {
    setSearchTerm('');
    setSelectedCategory(prev => prev === category ? null : category);
    setSelectedLetter(null);
  }

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF2' }}>
      {/* Main Content */}
      <div className="container mx-auto px-8">
        {/* Title */}
        <h1 className="text-center font-headline text-5xl uppercase tracking-[0.02em] mb-4" style={{ 
          color: '#544C43',
        }}>
          The Planning Bible
        </h1>
        
        {/* Main Content Grid - Fixed height container */}
        <div className="grid grid-cols-[80px_12px_1fr_12px_80px] gap-x-2 mb-10 max-w-5xl mx-auto" style={{ height: 'calc(100vh - 220px)' }}>
          {/* Alphabet Navigation - Fixed */}
          <div className="relative">
            <nav className="h-full">
              <ul className="flex flex-col items-end justify-between h-full">
                 <li className="flex items-center h-8">
                    <Button
                      variant="ghost"
                      className={cn(
                        'h-8 p-0 bg-transparent hover:bg-transparent font-ui text-sm font-bold tracking-[0.04em]',
                         selectedLetter === 'ALL' && !searchTerm && !selectedCategory ? 'text-primary' : 'text-brown-light'
                      )}
                      style={{ 
                        color: selectedLetter === 'ALL' && !searchTerm && !selectedCategory ? '#8EA75F' : '#8E8071',
                      }}
                      onClick={() => handleLetterClick('ALL')}
                    >
                      All
                    </Button>
                  </li>
                {alphabet.map((letter) => (
                  <li key={letter} className="flex items-center h-8">
                    <Button
                      variant="ghost"
                      className={cn(
                        'h-8 w-8 p-0 bg-transparent hover:bg-transparent font-ui text-lg font-bold tracking-[0.04em]',
                        !groupedTerms[letter]?.length && 'cursor-not-allowed opacity-30',
                         selectedLetter === letter && !searchTerm && !selectedCategory ? 'text-primary' : 'text-brown-light'
                      )}
                      style={{ 
                        color: selectedLetter === letter && !searchTerm && !selectedCategory ? '#8EA75F' : '#8E8071',
                      }}
                      onClick={() => handleLetterClick(letter)}
                      disabled={!groupedTerms[letter]?.length}
                    >
                      {letter}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Dynamic Vertical Separator with Gap and Arrow */}
          <div className="relative flex items-center">
            <div 
              className="absolute w-px inset-y-0 left-1/2 transform -translate-x-1/2"
              style={{ backgroundColor: '#544C43' }}
            />
            {selectedLetter && selectedLetter !== 'ALL' && !searchTerm && !selectedCategory && (
              <>
                <div 
                  className="absolute h-8 w-full left-1/2 transform -translate-x-1/2"
                  style={{ 
                    backgroundColor: '#FEFCF2',
                    top: `${(alphabet.indexOf(selectedLetter) * 32) + 32 + 2.5}px` // +32 for 'All' button
                  }}
                />
                <span 
                  className="absolute text-2xl"
                  style={{ 
                    color: '#544C43',
                    top: `${(alphabet.indexOf(selectedLetter) * 32) + 32}px`, // +32 for 'All' button
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >◀</span>
              </>
            )}
          </div>

          {/* Scrollable Definitions */}
          <div className="overflow-y-auto pr-4 -ml-8">
            <div className="pl-12 pb-8">
              {termsToDisplay.length > 0 ? (
                <div className="space-y-6">
                  {termsToDisplay.map((term) => (
                    <Dialog key={term.id} onOpenChange={(open) => { if (!open) setSelectedTerm(null); }}>
                      <DialogTrigger asChild>
                        <div className="text-center cursor-pointer group" onClick={() => setSelectedTerm(term)}>
                          <h2 
                            className="font-headline text-xl font-medium uppercase tracking-[0.02em]"
                            style={{ 
                              color: '#8EA75F',
                            }}
                          >
                            {term.term}
                          </h2>
                          <p 
                            className="mt-1 text-base leading-relaxed font-body line-clamp-2"
                            style={{ 
                              color: '#544C43',
                              lineHeight: '1.5'
                            }}
                          >
                            {term.definition}
                          </p>
                        </div>
                      </DialogTrigger>
                    </Dialog>
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center">
                  <p className="text-lg font-body" style={{ 
                    color: '#544C43',
                  }}>
                    {searchTerm
                      ? `No terms found for "${searchTerm}".`
                      : selectedCategory
                      ? `No terms found in the category "${selectedCategory}".`
                      : `There are no terms starting with the letter "${selectedLetter}".`}
                  </p>
                  <p className="mt-2 text-base font-body" style={{ 
                    color: '#8E8071',
                  }}>
                    {searchTerm
                      ? 'Try a different search.'
                      : 'Please select another letter or category.'}
                  </p>
                </div>
              )}
            </div>
          </div>
    {/* Right Vertical Separator with Dynamic Gap and Arrow */}
<div className="relative flex items-center">
  <div 
    className="absolute w-px inset-y-0 left-1/2 transform -translate-x-1/2"
    style={{ backgroundColor: '#544C43' }}
  />
  {selectedCategory && !searchTerm && !selectedLetter && (
    <>
      <div 
        className="absolute h-8 w-full left-1/2 transform -translate-x-1/2"
        style={{ 
          backgroundColor: '#FEFCF2',
          top: categories.indexOf(selectedCategory) === 0 
            ? '0px' 
            : categories.indexOf(selectedCategory) === categories.length - 1
            ? 'calc(100% - 32px)'
            : `calc(${(categories.indexOf(selectedCategory)) / (categories.length - 1) * 100}% - 14px)`
        }}
      />
      <span 
        className="absolute text-2xl"
        style={{ 
          color: '#544C43',
          top: categories.indexOf(selectedCategory) === 0 
            ? '-2px' 
            : categories.indexOf(selectedCategory) === categories.length - 1
            ? 'calc(100% - 34px)'
            : `calc(${(categories.indexOf(selectedCategory)) / (categories.length - 1) * 100}% - 16px)`,
          left: '50%',
          transform: 'translateX(-50%) scaleX(-1)'
        }}
      >◀</span>
    </>
  )}
</div>

          {/* Category Filters */}
          <div className="relative">
            <nav className="h-full">
              <ul className="flex flex-col items-start justify-between h-full">
                {categories.map((category) => (
                  <li key={category} className="flex items-center">
                    <Button
                      variant="ghost"
                      className={cn(
                        'h-8 p-0 bg-transparent hover:bg-transparent font-ui text-sm capitalize tracking-[0.04em]',
                        selectedCategory === category ? 'text-primary font-bold' : 'text-brown-light'
                      )}
                      style={{ 
                        color: selectedCategory === category ? '#8EA75F' : '#8E8071',
                      }}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Search Input Area */}
        <div className="flex-shrink-0 mt-20">
          <div className="relative mx-auto max-w-md">
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search keyword..."
              className="h-12 w-full rounded-lg border-border bg-background px-6 text-center text-base placeholder:text-center focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none font-body"
              style={{ 
                color: '#544C43',
                borderColor: '#D2CCC6'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for a planning term"
            />
            <span
              ref={searchTextRef}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 invisible h-0 whitespace-pre text-base font-body"
            >
              {searchTerm}
            </span>
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 h-6 w-6 -translate-y-1/2 transform hover:bg-transparent"
                style={{
                  ...clearButtonPosition,
                  color: '#8E8071'
                }}
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

      </div>
      
      {selectedTerm && (
        <Dialog open={!!selectedTerm} onOpenChange={(open) => { if (!open) setSelectedTerm(null); }}>
            <DialogContent className="sm:max-w-[625px] bg-card border-2 border-primary/20 shadow-lg p-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="bg-primary/5">
                    {selectedTerm.category && (
                      <CardDescription className="font-ui text-sm font-bold uppercase tracking-[0.04em] text-primary">
                        {selectedTerm.category}
                      </CardDescription>
                    )}
                    <CardTitle>
                      <DialogTitle asChild>
                        <h1 className="font-headline text-4xl font-medium uppercase tracking-[0.02em] md:text-5xl text-left leading-[1.2]">
                           {selectedTerm.term}
                        </h1>
                      </DialogTitle>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose prose-lg max-w-none text-foreground">
                      <p className="font-body text-lg leading-[1.5]">
                        {selectedTerm.definition}
                      </p>
                    </div>
                  </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    