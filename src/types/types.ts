import { ReactNode } from "react";

export type User = {
    id: string;
    name?: string;
    profile_pic?: string;
    email: string;
    role: string;
}

export type UrlInfoType = {
    originalUrl: string,
    customUrl?: string,
    user_id: string,
    title: string,
    qrCode: File,
}

export interface DialogProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export interface DialogTriggerProps {
    children: ReactNode;
    onClick: () => void;
}

export interface BasicProps {
    children: ReactNode;
}

export interface DialogCloseProps {
    onClose: () => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline';
}

export interface LabelProps {
    children: ReactNode;
    htmlFor: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    placeholder?: string;
}