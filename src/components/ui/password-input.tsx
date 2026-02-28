import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({ id, value, onChange, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="pr-10"
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </Button>
    </div>
  );
}
