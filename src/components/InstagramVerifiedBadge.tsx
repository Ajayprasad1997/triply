import React from 'react';

interface InstagramVerifiedBadgeProps {
  size?: number;
  className?: string;
  title?: string;
}

export const InstagramVerifiedBadge: React.FC<InstagramVerifiedBadgeProps> = ({
  size = 16,
  className = '',
  title = 'Verified Partner'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 align-middle ${className}`}
      title={title}
      aria-label={title}
    >
      {/* Official Instagram Scalloped Blue Rosette */}
      <path
        d="M10.5213 2.62368C11.3147 1.75257 12.6853 1.75257 13.4787 2.62368L14.4989 3.74395C14.9323 4.21986 15.5457 4.47391 16.1837 4.44111L17.6845 4.36395C18.8524 4.30397 19.8228 5.27438 19.7628 6.44229L19.6857 7.94314C19.6529 8.58107 19.9069 9.19451 20.3828 9.62791L21.5031 10.6481C22.3742 11.4415 22.3742 12.8121 21.5031 13.6055L20.3828 14.6257C19.9069 15.0591 19.6529 15.6725 19.6857 16.3105L19.7628 17.8113C19.8228 18.9792 18.8524 19.9496 17.6845 19.8897L16.1837 19.8125C15.5457 19.7797 14.9323 20.0337 14.4989 20.5097L13.4787 21.6299C12.6853 22.501 11.3147 22.501 10.5213 21.6299L9.50107 20.5097C9.06767 20.0337 8.45423 19.7797 7.8163 19.8125L6.31548 19.8897C5.14757 19.9496 4.17716 18.9792 4.23714 17.8113L4.3143 16.3105C4.3471 15.6725 4.09305 15.0591 3.61714 14.6257L2.49687 13.6055C1.62576 12.8121 1.62576 11.4415 2.49687 10.6481L3.61714 9.62791C4.09305 9.19451 4.3471 8.58107 4.3143 7.94314L4.23714 6.44229C4.17716 5.27438 5.14757 4.30397 6.31548 4.36395L7.8163 4.44111C8.45423 4.47391 9.06767 4.21986 9.50107 3.74395L10.5213 2.62368Z"
        fill="#0095F6"
      />
      {/* Centered Crisp White Checkmark */}
      <path
        d="M8.8 12.3L11 14.5L15.8 9.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
