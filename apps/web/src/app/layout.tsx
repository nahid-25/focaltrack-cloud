export const metadata = {
  title: "FocalTrack Admin",
  description: "Time tracking dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI" }}>
        {children}
      </body>
    </html>
  );
}
