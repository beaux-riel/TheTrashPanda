-- Add explicit lat/lng columns since PostGIS geography returns as hex WKB
-- through the REST API, which is unusable client-side without a parser.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lng double precision;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS lng double precision;

-- Backfill from existing geography column
UPDATE profiles SET
  lat = ST_Y(location::geometry),
  lng = ST_X(location::geometry)
WHERE location IS NOT NULL AND lat IS NULL;

UPDATE listings SET
  lat = ST_Y(location::geometry),
  lng = ST_X(location::geometry)
WHERE location IS NOT NULL AND lat IS NULL;

-- Create trigger to keep lat/lng in sync when location changes
CREATE OR REPLACE FUNCTION sync_lat_lng_from_location()
RETURNS trigger AS $$
BEGIN
  IF NEW.location IS NOT NULL THEN
    NEW.lat := ST_Y(NEW.location::geometry);
    NEW.lng := ST_X(NEW.location::geometry);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_sync_coords ON profiles;
CREATE TRIGGER profiles_sync_coords
  BEFORE INSERT OR UPDATE OF location ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_lat_lng_from_location();

DROP TRIGGER IF EXISTS listings_sync_coords ON listings;
CREATE TRIGGER listings_sync_coords
  BEFORE INSERT OR UPDATE OF location ON listings
  FOR EACH ROW EXECUTE FUNCTION sync_lat_lng_from_location();
