import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: 'VLOOKUP 公式助手 — 可视化生成 Excel VLOOKUP 公式',
  description: '上传 Excel 文件，通过可视化界面配置 VLOOKUP 参数，批量生成公式并导出结果。',
  keywords: ['VLOOKUP', 'Excel', '公式生成', '数据匹配', '电子表格'],
  openGraph: {
    title: 'VLOOKUP 公式助手',
    description: '可视化配置，批量生成 Excel VLOOKUP 公式。',
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
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
