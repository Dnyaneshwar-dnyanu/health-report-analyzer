import { 
  FiHome, 
  FiUploadCloud, 
  FiPieChart, 
  FiClock, 
  FiMessageSquare, 
  FiSettings 
} from 'react-icons/fi';

export const navigationLinks = [
  { name: 'Home', path: '/', icon: FiHome },
  { name: 'Upload', path: '/upload', icon: FiUploadCloud },
  { name: 'Dashboard', path: '/dashboard', icon: FiPieChart },
  { name: 'History', path: '/history', icon: FiClock },
  { name: 'AI Chat', path: '/chat', icon: FiMessageSquare },
];

export const bottomLinks = [
  { name: 'Settings', path: '/settings', icon: FiSettings },
];
