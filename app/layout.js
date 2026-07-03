export const metadata = {
  title: "TDI Workspace",
  description: "TDI Workspace — interior design studio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
