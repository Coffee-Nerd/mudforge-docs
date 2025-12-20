# drawImageAlpha

Draws an image with alpha transparency and optional color tinting. This function allows you to draw images with varying levels of opacity and apply color filters.

## Syntax

```lua
drawImageAlpha(widgetId, imageUrl, x, y, width, height, alpha, tintColor)
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| widgetId | string | The ID of the canvas widget to draw on | Yes |
| imageUrl | string | URL or path to the image file | Yes |
| x | number | X coordinate of the top-left corner | Yes |
| y | number | Y coordinate of the top-left corner | Yes |
| width | number | Width to draw the image | Yes |
| height | number | Height to draw the image | Yes |
| alpha | number | Opacity level (0.0 to 1.0) | Yes |
| tintColor | string | Color to tint the image (optional) | No |

## Description

This function draws an image with the specified alpha transparency level. The alpha parameter controls the overall opacity of the image:
- 0.0 = Completely transparent (invisible)
- 0.5 = 50% transparent
- 1.0 = Fully opaque

If a tintColor is provided, it will be applied to the image, allowing you to colorize grayscale images or adjust the hue of colored images.

## Image Formats

Supported image formats:
- PNG (recommended for transparency)
- JPEG/JPG
- GIF (static only)
- WebP
- SVG

## Return Value

None

## Examples

### Basic Usage
```lua
-- Draw an image at 50% opacity
drawImageAlpha(widgetId, "/images/icon.png", 100, 100, 64, 64, 0.5)
```

### With Tinting
```lua
-- Draw a red-tinted image
drawImageAlpha(widgetId, "/images/icon.png", 100, 100, 64, 64, 1.0, "#ff0000")

-- Draw a semi-transparent blue-tinted image
drawImageAlpha(widgetId, "/images/icon.png", 200, 100, 64, 64, 0.7, "#0000ff")
```

### Fade Effect
```lua
-- Create a fade-in effect
function fadeInImage(widgetId, imageUrl, x, y, w, h)
    local alpha = 0
    local timerId
    
    timerId = addTimer(50, function()
        clearWidget(widgetId)
        drawImageAlpha(widgetId, imageUrl, x, y, w, h, alpha)
        
        alpha = alpha + 0.05
        if alpha >= 1.0 then
            removeTimer(timerId)
        end
    end, true)
end
```

### Ghost/Translucent Effect
```lua
-- Draw a ghost sprite
drawImageAlpha(widgetId, "/sprites/ghost.png", 150, 200, 48, 48, 0.6, "#ccccff")
```

### Status Icons with Transparency
```lua
function drawStatusIcon(widgetId, iconPath, x, y, active)
    local alpha = active and 1.0 or 0.3
    drawImageAlpha(widgetId, iconPath, x, y, 32, 32, alpha)
end

-- Draw active and inactive status icons
drawStatusIcon(widgetId, "/icons/shield.png", 10, 10, true)   -- Full opacity
drawStatusIcon(widgetId, "/icons/sword.png", 50, 10, false)   -- 30% opacity
```

## Notes

- The image must be loaded before it can be drawn. Use `preloadImage()` to ensure images are ready.
- Unlike MUSHclient's WindowDrawImageAlpha, this function supports both transparency AND stretching simultaneously.
- The tintColor parameter uses multiply blending, so white areas of the image will become the tint color.
- For best results with tinting, use grayscale images.
- Large images with transparency may impact performance; consider using smaller images or reducing the alpha complexity.

## Performance Tips

1. Preload images before drawing:
   ```lua
   preloadImage("/images/icon.png")
   ```

2. Cache widget references instead of using IDs repeatedly

3. Use batch operations when drawing multiple images:
   ```lua
   beginBatch(widgetId)
   drawImageAlpha(widgetId, img1, 0, 0, 32, 32, 0.5)
   drawImageAlpha(widgetId, img2, 32, 0, 32, 32, 0.5)
   drawImageAlpha(widgetId, img3, 64, 0, 32, 32, 0.5)
   endBatch(widgetId)
   ```

## See Also

- [drawImage](./drawImage.md) - Basic image drawing without alpha
- [drawImagePart](./drawImagePart.md) - Draw portions of images
- [drawImageRotated](./drawImageRotated.md) - Draw rotated images
- [preloadImage](./preloadImage.md) - Preload images for better performance
- [setBlendMode](./setBlendMode.md) - Set canvas blending mode