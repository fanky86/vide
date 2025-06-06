const [searchQuery, setSearchQuery] = useState('');

const filteredVideos = videoList.filter((video) =>
  video.name.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
  <>
    <TextField
      fullWidth
      label="Cari Video"
      variant="filled"
      margin="normal"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{ style: { backgroundColor: '#fff' } }}
    />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem',
        maxHeight: '500px',
        overflowY: 'auto',
      }}
    >
      {filteredVideos.map((video, idx) => (
        <div key={idx} style={{ position: 'relative' }}>
          <video
            src={video.url}
            style={{ width: '100%', cursor: 'pointer', borderRadius: '10px' }}
            onClick={() => setCurrentVideo(video.url)}
          ></video>
          {user?.role === 'admin' && (
            <button
              onClick={() => handleDelete(video.name)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'red',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Hapus
            </button>
          )}
        </div>
      ))}
    </div>
  </>
);
