#!/bin/bash
# Add a new DJ to the monorepo

if [ -z "$1" ]; then
  echo "Usage: ./scripts/new-dj.sh <dj-slug> [dj-name]"
  echo "Example: ./scripts/new-dj.sh dj-carlos 'Carlos López'"
  exit 1
fi

DJ_SLUG=$1
DJ_NAME=${2:-${DJ_SLUG}}

echo "Creating EPK for: $DJ_NAME ($DJ_SLUG)"

# Create directory structure
mkdir -p djs/$DJ_SLUG/assets

# Copy template files
cp template/index.html djs/$DJ_SLUG/
cp template/vercel.json djs/$DJ_SLUG/

# Update DJ_SLUG in HTML (simple sed replacement)
sed -i "s/const DJ_SLUG = \"dj-bini\"/const DJ_SLUG = \"$DJ_SLUG\"/" djs/$DJ_SLUG/index.html

echo ""
echo "✅ Created: djs/$DJ_SLUG/"
echo ""
echo "📝 Next steps:"
echo "1. Edit djs/$DJ_SLUG/index.html:"
echo "   - Update defaultData.bio (EN, ES, DE)"
echo "   - Add SoundCloud tracks URLs"
echo "   - Add shows"
echo "   - Upload photos to djs/$DJ_SLUG/assets/"
echo "   - Update socials and artist info"
echo ""
echo "2. Test locally:"
echo "   cd djs/$DJ_SLUG && python3 -m http.server 8000"
echo ""
echo "3. Commit:"
echo "   git add djs/$DJ_SLUG/"
echo "   git commit -m 'feat: add $DJ_NAME EPK'"
echo ""
