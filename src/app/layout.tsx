import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: 'VLOOKUP 公式助手',
  description: '可视化配置 Excel VLOOKUP 公式，支持批量生成、匹配预览和文件导出',
  keywords: ['VLOOKUP', 'Excel', '公式', '查找匹配', '电子表格'],
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: 'VLOOKUP 公式助手',
    description: '可视化配置 Excel VLOOKUP 公式，批量生成、匹配预览、文件导出',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
