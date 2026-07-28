import React from 'react';
import { Phone, CheckCircle, Trash2, Mail } from 'lucide-react';

export const TrustedContactCard = ({ contact, onDelete }) => {
  return (
    <div className="bg-blush-card border border-blush-border rounded-card p-4 flex items-center justify-between shadow-plum-subtle hover:shadow-card-hover transition-all">
      <div className="flex items-center space-x-3.5">
        <div className="w-11 h-11 rounded-full bg-rose/30 text-plum flex items-center justify-center font-bold text-base border border-rose/40">
          {contact.name.charAt(0)}
        </div>
        
        <div>
          <div className="flex items-center space-x-1.5">
            <h4 className="font-bold text-tichi-text text-sm">{contact.name}</h4>
            {contact.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-tichi-success fill-tichi-success/20" />
            )}
          </div>
          <p className="text-xs text-tichi-muted font-medium">{contact.relationship} • {contact.phone}</p>
          {contact.email && (
            <p className="text-[11px] text-plum font-medium flex items-center mt-0.5">
              <Mail className="w-3 h-3 mr-1" />
              {contact.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <a
          href={`tel:${contact.phone}`}
          className="p-2 rounded-xl bg-plum-50 text-plum hover:bg-plum hover:text-white transition-colors"
          title="Call Contact"
        >
          <Phone className="w-4 h-4" />
        </a>

        {onDelete && (
          <button
            onClick={() => onDelete(contact.id)}
            className="p-2 rounded-xl text-tichi-muted hover:text-tichi-emergency hover:bg-rose-soft transition-colors"
            title="Remove Contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
