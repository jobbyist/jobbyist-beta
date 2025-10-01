# Audio Files

This directory contains audio files for The Job Post podcast episodes.

## Note
The actual audio files (*.mp3) are not committed to git due to their large size.

For production:
- Audio files should be uploaded through the admin interface at `/admin/audio-upload`
- Files will be stored in Supabase Storage
- The system will automatically generate signed URLs for secure access

For development:
- Copy audio files from `attached_assets/` to this directory
- The files should match the names referenced in the database migrations
- Episode 1: `ep1-introducing-jobbyist.mp3`
- Episode 2: `ep2-reclaim-your-worth.mp3`

## File Structure
```
public/audio/
├── README.md
├── ep1-introducing-jobbyist.mp3 (not in git)
├── ep2-reclaim-your-worth.mp3 (not in git)
└── (future episodes)
```
