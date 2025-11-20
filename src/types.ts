import React from 'react';

export interface AppConfig {
    id: string;
    title: string;
    icon: React.ReactNode;
    component: React.ReactNode;
    width?: number;
    height?: number;
    canResize?: boolean;
    canMaximize?: boolean;
    showOnDesktop?: boolean;
    showInStartMenu?: boolean;
}

export interface AppData {
    url?: string;
    name?: string;
    [key: string]: unknown;
}

export interface WindowState {
    id: string;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    data?: AppData;
    position?: { x: number; y: number };
}

export interface DesktopState {
    wallpaper: string;
    iconSize: 'small' | 'medium' | 'large';
    sortOrder: 'name-asc' | 'name-desc' | 'none';
    layoutVersion: number;
}
