import React, { useState } from 'react';
import { 
  User,
  Palette,
  Shirt,
  Smile,
  Camera,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface AvatarCustomizerProps {
  onAvatarChange: (config: AvatarConfig) => void;
  initialConfig?: Partial<AvatarConfig>;
}

interface AvatarConfig {
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'adult' | 'senior';
  style: 'casual' | 'professional' | 'formal';
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  outfit: string;
  expression: string;
}

const defaultConfig: AvatarConfig = {
  gender: 'neutral',
  age: 'adult',
  style: 'casual',
  skinTone: '#E0B0A0',
  hairColor: '#4A3728',
  hairStyle: 'short',
  outfit: 'casual-1',
  expression: 'neutral'
};

export function AvatarCustomizer({
  onAvatarChange,
  initialConfig = {}
}: AvatarCustomizerProps) {
  const [config, setConfig] = useState<AvatarConfig>({
    ...defaultConfig,
    ...initialConfig
  });
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Caractéristiques de base',
      icon: <User />,
      fields: [
        {
          name: 'gender',
          label: 'Genre',
          options: [
            { value: 'male', label: 'Masculin' },
            { value: 'female', label: 'Féminin' },
            { value: 'neutral', label: 'Neutre' }
          ]
        },
        {
          name: 'age',
          label: 'Âge',
          options: [
            { value: 'young', label: 'Jeune' },
            { value: 'adult', label: 'Adulte' },
            { value: 'senior', label: 'Senior' }
          ]
        }
      ]
    },
    {
      title: 'Apparence',
      icon: <Palette />,
      fields: [
        {
          name: 'skinTone',
          label: 'Teint',
          type: 'color'
        },
        {
          name: 'hairColor',
          label: 'Couleur des cheveux',
          type: 'color'
        },
        {
          name: 'hairStyle',
          label: 'Coiffure',
          options: [
            { value: 'short', label: 'Court' },
            { value: 'medium', label: 'Mi-long' },
            { value: 'long', label: 'Long' }
          ]
        }
      ]
    },
    {
      title: 'Tenue',
      icon: <Shirt />,
      fields: [
        {
          name: 'style',
          label: 'Style',
          options: [
            { value: 'casual', label: 'Décontracté' },
            { value: 'professional', label: 'Professionnel' },
            { value: 'formal', label: 'Formel' }
          ]
        },
        {
          name: 'outfit',
          label: 'Tenue',
          options: [
            { value: 'casual-1', label: 'Tenue 1' },
            { value: 'casual-2', label: 'Tenue 2' },
            { value: 'formal-1', label: 'Tenue 3' }
          ]
        }
      ]
    },
    {
      title: 'Expression',
      icon: <Smile />,
      fields: [
        {
          name: 'expression',
          label: 'Expression',
          options: [
            { value: 'neutral', label: 'Neutre' },
            { value: 'happy', label: 'Souriant' },
            { value: 'serious', label: 'Sérieux' }
          ]
        }
      ]
    }
  ];

  const handleChange = (name: keyof AvatarConfig, value: string) => {
    const newConfig = { ...config, [name]: value };
    setConfig(newConfig);
    onAvatarChange(newConfig);
  };

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  return (
    <div className="space-y-6">
      {/* Aperçu de l'avatar */}
      <div className="relative aspect-square max-w-xs mx-auto bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
        {/* Ici, vous intégrerez le rendu 3D de l'avatar */}
      </div>

      {/* Étapes de personnalisation */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center gap-4 p-4 border-b">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                currentStep === index
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {React.cloneElement(step.icon as React.ReactElement, {
                className: 'w-5 h-5'
              })}
              <span className="hidden md:inline">{step.title}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {steps[currentStep].fields.map(field => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                
                {field.type === 'color' ? (
                  <input
                    type="color"
                    value={config[field.name as keyof AvatarConfig] as string}
                    onChange={e => handleChange(field.name as keyof AvatarConfig, e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {field.options?.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleChange(field.name as keyof AvatarConfig, option.value)}
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          config[field.name as keyof AvatarConfig] === option.value
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between p-4 border-t">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Suivant
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}