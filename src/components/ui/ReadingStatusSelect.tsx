"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Clock, CheckCircle, Pause, X } from "lucide-react";

export type ReadingStatus =
  | "QUERO_LER"
  | "LENDO"
  | "LIDO"
  | "PAUSADO"
  | "ABANDONADO";

interface ReadingStatusSelectProps {
  value: ReadingStatus;
  onValueChange: (value: ReadingStatus) => void;
  className?: string;
}

const statusConfig = {
  QUERO_LER: {
    label: "Quero Ler",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: BookOpen,
  },
  LENDO: {
    label: "Lendo",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Clock,
  },
  LIDO: {
    label: "Lido",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle,
  },
  PAUSADO: {
    label: "Pausado",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Pause,
  },
  ABANDONADO: {
    label: "Abandonado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: X,
  },
};

export function ReadingStatusSelect({
  value,
  onValueChange,
  className = "",
}: ReadingStatusSelectProps) {
  const currentStatus = statusConfig[value];
  const Icon = currentStatus.icon;

  return (
    <div className={className}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Icon size={16} />
              <Badge className={`${currentStatus.color} border`}>
                {currentStatus.label}
              </Badge>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusConfig).map(([key, config]) => {
            const StatusIcon = config.icon;
            return (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <StatusIcon size={16} />
                  <Badge className={`${config.color} border`}>
                    {config.label}
                  </Badge>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getStatusBadge(status: ReadingStatus) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <Icon size={12} />
      {config.label}
    </Badge>
  );
}
