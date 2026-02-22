import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gantt Chart',
  description: 'Project Planning & Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
