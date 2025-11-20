import { Introduction } from '../apps/Introduction';
import { AboutMe } from '../apps/AboutMe';
import { Skills } from '../apps/Skills';
import { Games } from '../apps/Games';
import { FileManager } from '../apps/FileManager';
import { Projects } from '../apps/Projects';
import { Browser } from '../apps/Browser';
import { VideoPlayer } from '../apps/VideoPlayer';
import { Photos } from '../apps/Photos';
import { Personalization } from '../apps/Personalization';
import { User, Code, Gamepad2, FolderOpen, Globe, PlayCircle, Image as ImageIcon, Rocket, Briefcase, Settings } from 'lucide-react';
import type { AppConfig } from '../types';

export const INITIAL_APPS: Record<string, AppConfig> = {
    'intro': {
        id: 'intro',
        title: 'Introduction',
        icon: <Rocket size={24} color="#F472B6" />,
        component: <Introduction />,
        width: 700,
        height: 500
    },
    'about': {
        id: 'about',
        title: 'About Me',
        icon: <User size={24} color="#60A5FA" />,
        component: <AboutMe />,
        width: 900,
        height: 700
    },
    'skills': {
        id: 'skills',
        title: 'Skills',
        icon: <Code size={24} color="#34D399" />,
        component: <Skills />,
        width: 800,
        height: 600
    },
    'projects': {
        id: 'projects',
        title: 'Projects',
        icon: <Briefcase size={24} color="#FBBF24" />,
        component: <Projects />,
        width: 1000,
        height: 700
    },
    'games': {
        id: 'games',
        title: 'Games',
        icon: <Gamepad2 size={24} color="#A78BFA" />,
        component: <Games />,
        width: 900,
        height: 600
    },
    'files': {
        id: 'files',
        title: 'File Manager',
        icon: <FolderOpen size={24} color="#F59E0B" />,
        component: <FileManager />,
        width: 900,
        height: 600
    },
    'browser': {
        id: 'browser',
        title: 'Browser',
        icon: <Globe size={24} color="#3B82F6" />,
        component: <Browser />,
        width: 1000,
        height: 700
    },
    'video-player': {
        id: 'video-player',
        title: 'Video Player',
        icon: <PlayCircle size={24} color="#EF4444" />,
        component: <VideoPlayer />,
        width: 800,
        height: 500,
        showOnDesktop: false
    },
    'photos': {
        id: 'photos',
        title: 'Photos',
        icon: <ImageIcon size={24} color="#10B981" />,
        component: <Photos />,
        width: 800,
        height: 600,
        showOnDesktop: false
    },
    'personalization': {
        id: 'personalization',
        title: 'Personalization',
        icon: <Settings size={24} color="#6366F1" />,
        component: <Personalization />,
        width: 800,
        height: 600,
        showOnDesktop: false,
        showInStartMenu: false
    }
};
