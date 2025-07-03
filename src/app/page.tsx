'use client';

import { useState } from 'react';
import { GameScreen } from '@/components/GameScreen';
import { SettingsModal } from '@/components/SettingsModal';
import { Button, useTheme } from '@/components/ui';
import { PlayIcon, Cog6ToothIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <SunIcon className="w-5 h-5" />;
    if (theme === 'dark') return <MoonIcon className="w-5 h-5" />;
    return <ComputerDesktopIcon className="w-5 h-5" />;
  };

  if (gameStarted) {
    return <GameScreen 
      onBackToHome={handleBackToMenu} 
      onOpenSettings={() => setShowSettings(true)}
    />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={`Trocar para tema ${theme === 'light' ? 'escuro' : theme === 'dark' ? 'sistema' : 'claro'}`}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          {getThemeIcon()}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          aria-label="Abrir configurações"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo/Title */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-game rotate-3 transform hover:rotate-6 transition-transform duration-300">
            <div className="grid grid-cols-2 gap-1 w-8 h-8">
              <div className="bg-white rounded-sm" />
              <div className="bg-primary-100 rounded-sm" />
              <div className="bg-primary-100 rounded-sm" />
              <div className="bg-white rounded-sm" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-display-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Block Grid
            </h1>
            <p className="text-body-lg text-gray-600 dark:text-gray-300">
              Encaixe peças e complete linhas!
            </p>
          </div>
        </div>

        {/* Game Stats Preview */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-game">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-display-sm font-bold text-primary-600 dark:text-primary-400">
                {localStorage.getItem('highScore') || '0'}
              </div>
              <div className="text-body-sm text-gray-500 dark:text-gray-400">Recorde</div>
            </div>
            <div>
              <div className="text-display-sm font-bold text-secondary-600 dark:text-secondary-400">
                {localStorage.getItem('totalGames') || '0'}
              </div>
              <div className="text-body-sm text-gray-500 dark:text-gray-400">Jogos</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleStartGame}
            size="lg"
            className="w-full text-lg shadow-xl"
          >
            <PlayIcon className="w-6 h-6 mr-2" />
            Jogar
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => setShowSettings(true)}
            className="w-full"
          >
            <Cog6ToothIcon className="w-5 h-5 mr-2" />
            Configurações
          </Button>
        </div>

        {/* Game Rules Preview */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 text-left">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Como jogar:</h3>
          <ul className="text-body-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Arraste peças para o tabuleiro 8×8</li>
            <li>• Complete linhas ou colunas para pontuar</li>
            <li>• Quebre múltiplas linhas para combo!</li>
          </ul>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </main>
  );
} 