import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = useMemo(() => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Contains number', met: /[0-9]/.test(password) },
      { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length;
    if (metCount === 0) return { label: '', color: '', width: '0%' };
    if (metCount <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (metCount <= 3) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
    if (metCount === 4) return { label: 'Good', color: 'bg-blue-500', width: '85%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  }, [requirements]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">Password Strength</span>
          {strength.label && (
            <span className={`text-xs font-medium ${
              strength.label === 'Weak' ? 'text-red-400' :
              strength.label === 'Fair' ? 'text-yellow-400' :
              strength.label === 'Good' ? 'text-blue-400' :
              'text-green-400'
            }`}>
              {strength.label}
            </span>
          )}
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: strength.width }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
            )}
            <span className={`text-xs ${req.met ? 'text-gray-400' : 'text-gray-600'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
