import { ReactNode } from 'react';
import clsx from 'clsx';

interface FieldWrapperProps {
    className?: string;
    children: ReactNode;
}

const FieldWrapper = ({ className = '', children }: FieldWrapperProps) => (
    <div className={clsx(className || 'mb-6')}>
        {children}
    </div>
);

export default FieldWrapper;
