import React from 'react';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status, showIcon = true }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          variant: 'default',
          className: 'bg-green-100 text-green-800 hover:bg-green-100',
          icon: CheckCircle,
          text: 'Approved'
        };
      case 'pending':
        return {
          variant: 'secondary',
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
          icon: Clock,
          text: 'Pending'
        };
      case 'rejected':
        return {
          variant: 'destructive',
          className: 'bg-red-100 text-red-800 hover:bg-red-100',
          icon: XCircle,
          text: 'Rejected'
        };
      case 'draft':
        return {
          variant: 'outline',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
          icon: AlertCircle,
          text: 'Draft'
        };
      default:
        return {
          variant: 'outline',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
          icon: AlertCircle,
          text: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.text}
    </Badge>
  );
};

export default StatusBadge;