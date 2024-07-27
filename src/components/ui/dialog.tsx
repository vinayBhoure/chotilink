import { DialogProps, DialogTriggerProps, BasicProps, DialogCloseProps, ButtonProps, LabelProps, InputProps } from '@/types/types' 

export const Dialog: React.FC<DialogProps> = ({ children, isOpen, onClose }) => (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="bg-gray-500 bg-opacity-50 absolute inset-0" onClick={onClose}></div>
        <div className="bg-white p-6 rounded-lg z-10 max-w-lg w-full">{children}</div>
    </div>
);

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onClick }) => (
    <div onClick={onClick}>{children}</div>
);

export const DialogHeader: React.FC<BasicProps> = ({ children }) => (
    <div className="mb-4">{children}</div>
);

export const DialogTitle: React.FC<BasicProps> = ({ children }) => (
    <h2 className="text-lg font-bold">{children}</h2>
);

export const DialogContent: React.FC<BasicProps> = ({ children }) => (
    <div>{children}</div>
);

export const DialogFooter: React.FC<BasicProps> = ({ children }) => (
    <div className="mt-4 flex justify-end space-x-2">{children}</div>
);

export const DialogClose: React.FC<DialogCloseProps> = ({ onClose }) => (
    <button className="absolute top-0 right-0 mt-4 mr-4" onClick={onClose}>×</button>
);

export const Button: React.FC<ButtonProps> = ({ children, variant = 'default', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded';
    const variantClasses = variant === 'outline'
        ? 'border border-gray-500 text-gray-500 hover:bg-gray-100'
        : 'bg-blue-500 text-white hover:bg-blue-600';
    return (
        <button className={`${baseClasses} ${variantClasses}`} {...props}>
            {children}
        </button>
    );
};

export const Label: React.FC<LabelProps> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-right">{children}</label>
);

export const Input: React.FC<InputProps> = ({ id, placeholder, ...props }) => (
    <input id={id} placeholder={placeholder} className="border border-gray-300 p-2 rounded w-full" {...props} />
);