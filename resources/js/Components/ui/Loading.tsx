import { Spinner } from 'flowbite-react';

interface LoadingProps {
  show: boolean;
  ariaLabel?: string;
}

export default function Loading({ show, ariaLabel }: LoadingProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="text-white text-2xl">
        <Spinner aria-label={ariaLabel || 'Loading'} size="xl" />
      </div>
    </div>
  );
};
