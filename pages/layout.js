// ==== app/layout.js ====
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#111', color: 'white' }}>
        {children}
      </body>
    </html>
  );
}
