export default function ContactPage() {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '3rem auto',
        padding: '1rem',
        backgroundColor: '#222',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <h2>Kontak Support</h2>
      <p>
        Jika ada pertanyaan, hubungi kami melalui:
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>Email: <a href="mailto:support@fankyxd.xyz" style={{ color: '#4caf50' }}>support@fankyxd.xyz</a></li>
        <li>Telepon: <a href="tel:+62895359611122" style={{ color: '#4caf50' }}>0895-3596-11122</a></li>
        <li>Website: <a href="https://fankyxd.xyz" target="_blank" rel="noreferrer" style={{ color: '#4caf50' }}>https://fankyxd.xyz</a></li>
      </ul>
    </div>
  );
}
