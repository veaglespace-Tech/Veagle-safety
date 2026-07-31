import React from 'react';
import { Phone, CheckCircle, Trash2, Mail } from 'lucide-react';

export const TrustedContactCard = ({ contact, onDelete }) => {
  return (
    <div className="bg-gradient-to-br from-white via-[#FFF0F3] to-white border-2 border-[#FFCCE1] hover:border-[#FF5C8A] rounded-2xl p-4 flex items-center justify-between shadow-[0_6px_20px_rgba(255,92,138,0.12)] hover:shadow-[0_10px_28px_rgba(255,42,109,0.22)] transition-all duration-300">
      <div className="flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5C8A] to-[#FF2A6D] text-white flex items-center justify-center font-black text-base border-2 border-white shadow-md">
          {contact.name.charAt(0)}
        </div>
        
        <div>
          <div className="flex items-center space-x-1.5">
            <h4 className="font-black text-[#2A0826] text-sm">{contact.name}</h4>
            {contact.isVerified && (
              <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
            )}
          </div>
          <p className="text-xs text-[#684E67] font-bold">{contact.relationship} • {contact.phone}</p>
          {contact.email && (
            <p className="text-[11px] text-[#FF2A6D] font-extrabold flex items-center mt-0.5">
              <Mail className="w-3 h-3 mr-1 text-[#FF2A6D]" />
              {contact.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <a
          href={`tel:${contact.phone}`}
          className="p-2.5 rounded-xl bg-gradient-to-tr from-[#FF5C8A] to-[#FF2A6D] text-white hover:scale-110 shadow-sm transition-all"
          title="Call Contact"
        >
          <Phone className="w-4 h-4" />
        </a>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(contact.id)}
            className="p-2.5 rounded-xl text-[#684E67] hover:text-[#FF2A6D] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
            title="Remove Contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
