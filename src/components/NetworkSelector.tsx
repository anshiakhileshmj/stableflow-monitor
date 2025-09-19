
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_NETWORKS } from '@/lib/networks';
import { NETWORK_LOGOS } from '@/lib/network-logos';

interface NetworkSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ 
  value, 
  onValueChange, 
  className = "" 
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select Network" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(SUPPORTED_NETWORKS).map((network) => (
          <SelectItem key={network.id} value={network.id}>
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                {NETWORK_LOGOS[network.id] && (
                  <img src={NETWORK_LOGOS[network.id]} alt={network.name + ' logo'} className="w-5 h-5" />
                )}
                <span>{network.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({network.nativeCurrency.symbol})
                </span>
              </div>
              {value === network.id && (
                <svg className="w-5 h-5 text-primary font-bold ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NetworkSelector;
