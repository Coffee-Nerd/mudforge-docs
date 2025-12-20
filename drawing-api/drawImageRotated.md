# drawImageRotated

Draws an image with rotation around a specified center point. This function enables rotating sprites and images for dynamic visual effects.

## Syntax

```lua
drawImageRotated(widgetId, imageUrl, x, y, width, height, angle, centerX, centerY)
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| widgetId | string | The ID of the canvas widget to draw on | Yes |
| imageUrl | string | URL or path to the image file | Yes |
| x | number | X coordinate of the top-left corner (before rotation) | Yes |
| y | number | Y coordinate of the top-left corner (before rotation) | Yes |
| width | number | Width to draw the image | Yes |
| height | number | Height to draw the image | Yes |
| angle | number | Rotation angle in radians | Yes |
| centerX | number | X offset of rotation center from top-left (default: width/2) | No |
| centerY | number | Y offset of rotation center from top-left (default: height/2) | No |

## Description

This function draws an image rotated by the specified angle. The rotation is performed around a center point, which defaults to the center of the image but can be customized.

Key features:
- Rotation is specified in radians (0 to 2π)
- Positive angles rotate clockwise
- The center point is relative to the image's top-left corner
- Maintains image quality during rotation

## Return Value

None

## Examples

### Basic Rotation
```lua
-- Draw an image rotated 45 degrees
local angleInDegrees = 45
local angleInRadians = angleInDegrees * (math.pi / 180)
drawImageRotated(widgetId, "/images/arrow.png", 100, 100, 64, 64, angleInRadians)
```

### Continuous Rotation Animation
```lua
-- Create a spinning effect
local rotation = 0
local spinTimer

function startSpinning(widgetId, imageUrl, x, y, size)
    spinTimer = addTimer(50, function()
        clearWidget(widgetId)
        drawImageRotated(widgetId, imageUrl, x, y, size, size, rotation)
        rotation = rotation + 0.1  -- Rotate ~5.7 degrees per frame
        if rotation > math.pi * 2 then
            rotation = rotation - math.pi * 2
        end
    end, true)
end

-- Start spinning an image
startSpinning(widgetId, "/images/star.png", 200, 200, 48)
```

### Rotating Around Custom Point
```lua
-- Rotate around the top-left corner instead of center
drawImageRotated(widgetId, "/images/pointer.png", 150, 150, 100, 20, math.pi/4, 0, 0)

-- Rotate around the bottom-right corner
drawImageRotated(widgetId, "/images/flag.png", 200, 100, 80, 60, math.pi/6, 80, 60)
```

### Compass Needle
```lua
function drawCompass(widgetId, x, y, size, direction)
    -- Draw compass background
    drawImage(widgetId, "/images/compass_bg.png", x, y, size, size)
    
    -- Draw needle pointing to direction (0 = North, π/2 = East, etc.)
    local needleSize = size * 0.8
    local offset = (size - needleSize) / 2
    drawImageRotated(widgetId, 
        "/images/compass_needle.png", 
        x + offset, y + offset, 
        needleSize, needleSize, 
        direction
    )
end

-- Draw compass pointing northeast
drawCompass(widgetId, 300, 50, 100, math.pi / 4)
```

### Character Direction Indicator
```lua
-- Draw character sprite facing different directions
function drawCharacter(widgetId, x, y, facing)
    local directions = {
        north = 0,
        east = math.pi / 2,
        south = math.pi,
        west = math.pi * 1.5
    }
    
    local angle = directions[facing] or 0
    drawImageRotated(widgetId, "/sprites/character.png", x, y, 32, 32, angle)
end

-- Draw character facing east
drawCharacter(widgetId, 100, 200, "east")
```

### Rotating with Transparency
```lua
-- Combine rotation with alpha transparency
function drawRotatingGhost(widgetId, x, y, angle, alpha)
    -- First draw with rotation
    saveCanvas(widgetId)
    setBlendMode(widgetId, "normal")
    
    -- Draw rotated image with custom alpha
    -- Note: You might need to combine this with drawImageAlpha
    -- or use canvas globalAlpha if supported
    drawImageRotated(widgetId, "/sprites/ghost.png", x, y, 48, 48, angle)
    
    restoreCanvas(widgetId)
end
```

### Clock Hands
```lua
function drawClock(widgetId, x, y, radius, hours, minutes)
    -- Draw clock face
    drawCircle(widgetId, x + radius, y + radius, radius, "#ffffff", "#000000")
    
    -- Calculate angles (clock starts at 12, so subtract π/2)
    local hourAngle = (hours % 12) * (math.pi / 6) - (math.pi / 2)
    local minuteAngle = minutes * (math.pi / 30) - (math.pi / 2)
    
    -- Draw hour hand (shorter)
    local hourLength = radius * 0.6
    drawImageRotated(widgetId, 
        "/images/clock_hand.png", 
        x + radius - 5, y + radius - hourLength,
        10, hourLength,
        hourAngle,
        5, hourLength  -- Rotate around bottom center of hand
    )
    
    -- Draw minute hand (longer)
    local minuteLength = radius * 0.8
    drawImageRotated(widgetId,
        "/images/clock_hand.png",
        x + radius - 3, y + radius - minuteLength,
        6, minuteLength,
        minuteAngle,
        3, minuteLength
    )
end

-- Draw a clock showing 3:15
drawClock(widgetId, 50, 50, 50, 3, 15)
```

## Angle Conversion

```lua
-- Helper functions for angle conversion
function degreesToRadians(degrees)
    return degrees * (math.pi / 180)
end

function radiansToDegrees(radians)
    return radians * (180 / math.pi)
end

-- Common angles
local angles = {
    right = 0,
    down = math.pi / 2,
    left = math.pi,
    up = math.pi * 1.5,
    
    -- Diagonal directions
    downRight = math.pi / 4,
    downLeft = math.pi * 0.75,
    upLeft = math.pi * 1.25,
    upRight = math.pi * 1.75
}
```

## Performance Tips

1. **Preload images** before rotating:
   ```lua
   preloadImage("/images/arrow.png")
   ```

2. **Cache rotated images** if rotating to fixed angles repeatedly

3. **Use batch operations** for multiple rotations:
   ```lua
   beginBatch(widgetId)
   drawImageRotated(widgetId, img1, 0, 0, 32, 32, angle1)
   drawImageRotated(widgetId, img2, 40, 0, 32, 32, angle2)
   endBatch(widgetId)
   ```

4. **Limit rotation frequency** in animations to reduce CPU usage

## Notes

- Unlike MUSHclient, this function supports both rotation AND transparency in the same operation
- The image quality is preserved during rotation using bilinear interpolation by default
- For pixel art, you may want to set render hints for pixelated rendering
- Large images may show performance impact when rotated frequently
- The rotation center (centerX, centerY) is relative to the image position, not the canvas

## See Also

- [drawImage](./drawImage.md) - Basic image drawing
- [drawImageAlpha](./drawImageAlpha.md) - Draw images with transparency
- [drawImagePart](./drawImagePart.md) - Draw portions of images
- [setRenderHint](./setRenderHint.md) - Control rendering quality
- [saveCanvas](./saveCanvas.md) - Save canvas state before transformations