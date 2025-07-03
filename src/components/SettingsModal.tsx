'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, useTheme } from '@/components/ui';
import { SpeakerWaveIcon, SpeakerXMarkIcon, MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.7);
  const { theme, setTheme } = useTheme();

  // Load settings from localStorage
  useEffect(() => {
    const savedBgm = localStorage.getItem('blockgrid_bgm_enabled');
    const savedSfx = localStorage.getItem('blockgrid_sfx_enabled');
    const savedBgmVolume = localStorage.getItem('blockgrid_bgm_volume');
    const savedSfxVolume = localStorage.getItem('blockgrid_sfx_volume');

    if (savedBgm !== null) setBgmEnabled(savedBgm === 'true');
    if (savedSfx !== null) setSfxEnabled(savedSfx === 'true');
    if (savedBgmVolume !== null) setBgmVolume(parseFloat(savedBgmVolume));
    if (savedSfxVolume !== null) setSfxVolume(parseFloat(savedSfxVolume));
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('blockgrid_bgm_enabled', bgmEnabled.toString());
    localStorage.setItem('blockgrid_sfx_enabled', sfxEnabled.toString());
    localStorage.setItem('blockgrid_bgm_volume', bgmVolume.toString());
    localStorage.setItem('blockgrid_sfx_volume', sfxVolume.toString());
  };

  const handleClose = () => {
    saveSettings();
    onClose();
  };

  const handleRestartGame = () => {
    if (confirm('Tem certeza que deseja reiniciar a partida? Todo o progresso será perdido.')) {
      handleClose();
      window.location.reload();
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <SunIcon className="w-5 h-5" />;
    if (theme === 'dark') return <MoonIcon className="w-5 h-5" />;
    return <ComputerDesktopIcon className="w-5 h-5" />;
  };

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Configurações" size="md">
      <div className="space-y-6">
        {/* Theme Settings */}
        <div>
          <h3 className="text-body-lg font-semibold text-gray-900 dark:text-white mb-3">
            Aparência
          </h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center space-x-3">
              {getThemeIcon()}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Tema</div>
                <div className="text-body-sm text-gray-500 dark:text-gray-400">
                  {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={toggleTheme}>
              Alterar
            </Button>
          </div>
        </div>

        {/* Audio Settings */}
        <div>
          <h3 className="text-body-lg font-semibold text-gray-900 dark:text-white mb-3">
            Áudio
          </h3>
          
          {/* BGM Settings */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {bgmEnabled ? <SpeakerWaveIcon className="w-5 h-5" /> : <SpeakerXMarkIcon className="w-5 h-5" />}
                <span className="font-medium text-gray-900 dark:text-white">Música de Fundo</span>
              </div>
              <button
                onClick={() => setBgmEnabled(!bgmEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  bgmEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    bgmEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {bgmEnabled && (
              <div className="flex items-center space-x-3">
                <span className="text-body-sm text-gray-600 dark:text-gray-300">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={bgmVolume}
                  onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-body-sm text-gray-600 dark:text-gray-300 w-10">
                  {Math.round(bgmVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* SFX Settings */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-4 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {sfxEnabled ? <SpeakerWaveIcon className="w-5 h-5" /> : <SpeakerXMarkIcon className="w-5 h-5" />}
                <span className="font-medium text-gray-900 dark:text-white">Efeitos Sonoros</span>
              </div>
              <button
                onClick={() => setSfxEnabled(!sfxEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sfxEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sfxEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {sfxEnabled && (
              <div className="flex items-center space-x-3">
                <span className="text-body-sm text-gray-600 dark:text-gray-300">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-body-sm text-gray-600 dark:text-gray-300 w-10">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Game Actions */}
        <div>
          <h3 className="text-body-lg font-semibold text-gray-900 dark:text-white mb-3">
            Ações do Jogo
          </h3>
          <Button
            variant="danger"
            onClick={handleRestartGame}
            className="w-full"
          >
            Reiniciar Partida
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleClose}
          >
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 