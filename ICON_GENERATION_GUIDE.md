# Android Launcher Icon Generation Guide

## Current Setup

This project includes placeholder launcher icons in all required Android density buckets. To replace these with your actual app icons:

### Option 1: Using Android Studio (Recommended)

1. Open Android Studio
2. Right-click on `android/app/src/main/res` → **New** → **Image Asset**
3. Choose **Icon Type**: Launcher Icons (Adaptive and Legacy)
4. Upload your icon (192x192 px or larger PNG/SVG)
5. Android Studio will automatically generate all density variants

### Option 2: Using Command Line with ImageMagick

If you have a source icon at `icon.png` (192x192 or larger):

```bash
# Install ImageMagick if needed
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Linux

# Generate all density variants
mkdir -p android/app/src/main/res/mipmap-{ldpi,mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}

# Convert and resize for each density
convert icon.png -resize 36x36 android/app/src/main/res/mipmap-ldpi/ic_launcher.png
convert icon.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert icon.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert icon.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert icon.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert icon.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Repeat for rounded variant (or create separately)
convert icon-round.png -resize 36x36 android/app/src/main/res/mipmap-ldpi/ic_launcher_round.png
convert icon-round.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
# ... and so on
```

### Option 3: Using Online Tools

1. Visit [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
2. Upload your icon image
3. Configure colors and style
4. Download the generated assets ZIP
5. Extract and merge into `android/app/src/main/res/`

## Icon Specifications

### Density Buckets

| Density | Size | DPI |
|---------|------|-----|
| ldpi | 36×36 | 120 |
| mdpi | 48×48 | 160 |
| hdpi | 72×72 | 240 |
| xhdpi | 96×96 | 320 |
| xxhdpi | 144×144 | 480 |
| xxxhdpi | 192×192 | 640 |

### Adaptive Icons (Android 13+)

- Defined in `mipmap-anydpi-v33/` as XML files
- Uses foreground drawable (`ic_launcher_fg.xml`) and background color
- Supports dynamic safe zone (currently using a circular mask)

## Manifest References

The following are already configured in `AndroidManifest.xml`:

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    ...
</application>
```

- `@mipmap/ic_launcher` - Square launcher icon
- `@mipmap/ic_launcher_round` - Rounded launcher icon (used on launcher apps that support it)

## Recommended Icon Design

- **Use a 192×192 px source** and scale down (never scale up)
- **Leave padding** (~20% safe area) for adaptive icon safe zones
- **Use solid colors** for best rendering across all sizes
- **Test on multiple devices** to ensure clarity at all densities

## Building and Testing

Once icons are replaced:

```bash
cd android
./gradlew clean assembleDebug
```

The build will succeed without the "resource not found" errors.
