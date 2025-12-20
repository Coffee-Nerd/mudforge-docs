# drawImagePart

Draws a portion of an image, allowing for sprite sheet rendering and image cropping. This is essential for efficient sprite-based graphics.

## Syntax

```lua
drawImagePart(widgetId, imageUrl, destX, destY, destWidth, destHeight, srcX, srcY, srcWidth, srcHeight)
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| widgetId | string | The ID of the canvas widget to draw on | Yes |
| imageUrl | string | URL or path to the source image | Yes |
| destX | number | X coordinate to draw at (destination) | Yes |
| destY | number | Y coordinate to draw at (destination) | Yes |
| destWidth | number | Width to draw (destination) | Yes |
| destHeight | number | Height to draw (destination) | Yes |
| srcX | number | X coordinate in source image | Yes |
| srcY | number | Y coordinate in source image | Yes |
| srcWidth | number | Width to copy from source | Yes |
| srcHeight | number | Height to copy from source | Yes |

## Description

This function copies a rectangular portion of a source image and draws it to the canvas. This is particularly useful for:
- Sprite sheets (multiple images in one file)
- Tiled graphics
- Cropping images
- Creating animations from sprite strips

The function maps a source rectangle (srcX, srcY, srcWidth, srcHeight) from the image to a destination rectangle (destX, destY, destWidth, destHeight) on the canvas.

## Return Value

None

## Examples

### Basic Sprite Sheet Usage
```lua
-- Draw a 32x32 sprite from a sprite sheet
-- Sprite at row 2, column 3 (0-indexed)
drawImagePart(widgetId, 
    "/images/sprites.png",
    100, 100, 32, 32,      -- destination: draw at (100,100) with size 32x32
    96, 64, 32, 32         -- source: col 3 * 32, row 2 * 32, size 32x32
)
```

### Sprite Sheet Helper Function
```lua
-- Helper function for sprite sheets with uniform grid
function drawSprite(widgetId, sheetUrl, col, row, x, y, spriteSize)
    spriteSize = spriteSize or 32
    drawImagePart(widgetId,
        sheetUrl,
        x, y, spriteSize, spriteSize,
        col * spriteSize, row * spriteSize, spriteSize, spriteSize
    )
end

-- Draw sprite at grid position (4, 2)
drawSprite(widgetId, "/images/tileset.png", 4, 2, 150, 200)
```

### Animated Sprite
```lua
-- Animate through a horizontal sprite strip
local animFrame = 0
local animTimer

function startAnimation(widgetId, stripUrl, x, y, frameWidth, frameHeight, frameCount)
    animTimer = addTimer(100, function()
        -- Clear previous frame area
        clearWidget(widgetId)
        
        -- Draw current frame
        drawImagePart(widgetId,
            stripUrl,
            x, y, frameWidth, frameHeight,
            animFrame * frameWidth, 0, frameWidth, frameHeight
        )
        
        -- Next frame
        animFrame = (animFrame + 1) % frameCount
    end, true)
end

-- Start a 8-frame animation
startAnimation(widgetId, "/images/walk_cycle.png", 100, 100, 64, 64, 8)
```

### Scaling Sprites
```lua
-- Draw a 16x16 sprite scaled up to 64x64
drawImagePart(widgetId,
    "/images/tiny_sprites.png",
    200, 100, 64, 64,      -- destination: 4x larger
    32, 16, 16, 16         -- source: original 16x16 sprite
)
```

### Health Bar from Sprite Sheet
```lua
function drawHealthBarSprite(widgetId, sheetUrl, x, y, health, maxHealth)
    local barWidth = 100
    local barHeight = 20
    local fillPercent = health / maxHealth
    
    -- Draw empty bar background (sprite at 0,0)
    drawImagePart(widgetId, sheetUrl, x, y, barWidth, barHeight, 0, 0, 100, 20)
    
    -- Draw filled portion (sprite at 0,20)
    local fillWidth = math.floor(barWidth * fillPercent)
    if fillWidth > 0 then
        drawImagePart(widgetId, sheetUrl, 
            x, y, fillWidth, barHeight,
            0, 20, fillWidth, 20
        )
    end
end
```

### Tiled Background
```lua
function drawTiledBackground(widgetId, tileUrl, tileSize, widgetWidth, widgetHeight)
    local cols = math.ceil(widgetWidth / tileSize)
    local rows = math.ceil(widgetHeight / tileSize)
    
    beginBatch(widgetId)
    for row = 0, rows - 1 do
        for col = 0, cols - 1 do
            drawImagePart(widgetId,
                tileUrl,
                col * tileSize, row * tileSize, tileSize, tileSize,
                0, 0, tileSize, tileSize
            )
        end
    end
    endBatch(widgetId)
end

-- Draw a tiled stone floor
drawTiledBackground(widgetId, "/textures/stone.png", 32, 400, 300)
```

## Sprite Sheet Organization

Common sprite sheet layouts:
- **Grid Layout**: Uniform sprites in rows and columns
- **Packed Layout**: Sprites packed tightly (requires position data)
- **Animation Strips**: Sequential frames in horizontal/vertical strips

### Example Grid Calculation
```lua
-- For a grid-based sprite sheet
function getSpritePosition(index, columns, spriteWidth, spriteHeight)
    local row = math.floor(index / columns)
    local col = index % columns
    return {
        x = col * spriteWidth,
        y = row * spriteHeight,
        width = spriteWidth,
        height = spriteHeight
    }
end
```

## Performance Tips

1. **Use sprite sheets** instead of individual images to reduce HTTP requests
2. **Preload sprite sheets** before use:
   ```lua
   preloadImage("/images/sprites.png")
   ```
3. **Batch sprite drawing** when rendering multiple sprites:
   ```lua
   beginBatch(widgetId)
   -- Draw multiple sprites
   endBatch(widgetId)
   ```
4. **Cache calculations** for frequently used sprites

## Notes

- Source coordinates must be within the bounds of the source image
- The destination can be scaled (different size than source)
- Supports all common image formats (PNG, JPEG, GIF, WebP)
- For pixel-perfect rendering, ensure destination size matches source size

## See Also

- [drawImage](./drawImage.md) - Draw complete images
- [drawImageAlpha](./drawImageAlpha.md) - Draw images with transparency
- [drawImageRotated](./drawImageRotated.md) - Draw rotated images
- [preloadImage](./preloadImage.md) - Preload images
- [beginBatch](./beginBatch.md) - Optimize multiple draw calls