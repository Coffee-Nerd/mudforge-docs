# Drawing API Reference

The MUD Web Client plugin system provides a comprehensive drawing API that allows plugins to create rich visual content. This API is designed to match and exceed the capabilities of traditional MUD clients like MUSHclient and Mudlet.

## Overview

The drawing API provides functions for:
- **Basic Shapes** - Lines, rectangles, circles, ellipses, polygons, and arcs
- **Text Rendering** - Standard text, aligned text, and text with shadows
- **Color System** - MUD color codes, colorize(), and terminal output
- **Image Operations** - Basic image drawing, alpha blending, rotation, scaling, and sprite sheets
- **Gradients** - Linear and radial gradients
- **Canvas Management** - State saving/restoring, clipping regions, and blend modes
- **Pixel Operations** - Direct pixel manipulation
- **Performance** - Batch operations and render hints

## Categories

### Basic Shapes
- [drawLine](./drawLine.md) - Draw a line between two points
- [drawRect](./drawRect.md) - Draw a rectangle with optional fill and stroke
- [drawCircle](./drawCircle.md) - Draw a circle with optional fill and stroke
- [drawEllipse](./drawEllipse.md) - Draw an ellipse with optional fill and stroke
- [drawPolygon](./drawPolygon.md) - Draw a polygon from an array of points
- [drawArc](./drawArc.md) - Draw an arc segment

### Text Rendering
- [drawText](./drawText.md) - Draw text at a specific position
- [drawTextAligned](./drawTextAligned.md) - Draw text with alignment within a bounding box
- [drawTextWithShadow](./drawTextWithShadow.md) - Draw text with a shadow effect
- [measureText](./measureText.md) - Measure text dimensions before drawing

### Color System & Terminal Output
- **colorize(text, format)** - Parse MUD color codes for canvas or terminal
- **print(message)** - Output plain text to terminal widget
- **utilprint(message)** - Output colored text to terminal with automatic parsing

**MUD Color Codes**:
- `$N` - Basic colors (e.g., `$R`=red, `$G`=green, `$B`=blue)
- `$xNNN` - xterm 256 colors (e.g., `$x092`)
- `$XNNNNNN` - True color RGB hex (e.g., `$XFF0000`)

**Integration**: All text functions automatically accept `colorize()` segments for multi-colored text.

### Image Operations
- [drawImage](./drawImage.md) - Draw an image at a specific position
- [drawImageAlpha](./drawImageAlpha.md) - Draw an image with alpha transparency and optional tinting
- [drawImagePart](./drawImagePart.md) - Draw a portion of an image (sprite sheets)
- [drawImageRotated](./drawImageRotated.md) - Draw an image with rotation
- [preloadImage](./preloadImage.md) - Preload an image for better performance

### Gradients
- [drawGradient](./drawGradient.md) - Draw a linear gradient
- [drawRadialGradient](./drawRadialGradient.md) - Draw a radial gradient

### Canvas Operations
- [clearWidget](./clearWidget.md) - Clear the entire canvas
- [setClipRegion](./setClipRegion.md) - Set a clipping rectangle
- [resetClipRegion](./resetClipRegion.md) - Remove the clipping rectangle
- [setBlendMode](./setBlendMode.md) - Set the canvas blend mode
- [saveCanvas](./saveCanvas.md) - Save the current canvas state
- [restoreCanvas](./restoreCanvas.md) - Restore a previously saved canvas state

### Pixel Operations
- [getPixel](./getPixel.md) - Get the color of a specific pixel
- [setPixel](./setPixel.md) - Set the color of a specific pixel

### Performance
- [beginBatch](./beginBatch.md) - Begin batching draw operations
- [endBatch](./endBatch.md) - End batching and execute all operations
- [setRenderHint](./setRenderHint.md) - Set rendering quality hints

## Getting Started

To use the drawing API in your plugin:

```lua
-- Create a canvas widget
local widgetId = createWidget({
    type = "canvas",
    name = "My Drawing",
    position = { x = 100, y = 100 },
    size = { width = 400, height = 300 }
})

-- Draw a red rectangle
drawRect(widgetId, 10, 10, 100, 50, "#ff0000", "#000000")

-- Draw some text
drawText(widgetId, "Hello World!", 10, 80, "16px Arial", "#ffffff")

-- Draw colored text using MUD color codes
drawText(widgetId, colorize("$RRed $GGreen $BBlue"), 10, 110, "16px Arial")

-- Output colored text to terminal
utilprint("$CStatus: $GConnected")

-- Draw an image with 50% transparency
drawImageAlpha(widgetId, "/images/icon.png", 150, 10, 64, 64, 0.5)
```

## Color Format

Colors can be specified in several formats:
- Hex: `"#ff0000"` or `"#f00"`
- RGB: `"rgb(255, 0, 0)"`
- RGBA: `"rgba(255, 0, 0, 0.5)"`
- Named colors: `"red"`, `"blue"`, etc.

## Coordinate System

The drawing API uses a standard 2D coordinate system:
- Origin (0, 0) is at the top-left corner
- X increases to the right
- Y increases downward
- All measurements are in pixels

## Best Practices

1. **Preload Images**: Use `preloadImage()` to load images before drawing them
2. **Batch Operations**: Use `beginBatch()` and `endBatch()` for multiple draw calls
3. **Save/Restore State**: Use `saveCanvas()` and `restoreCanvas()` when making temporary changes
4. **Measure Text**: Use `measureText()` to ensure text fits within boundaries
5. **Clean Up**: Clear widgets when done to free memory

## Examples

### Drawing a Health Bar
```lua
function drawHealthBar(widgetId, x, y, width, height, current, max)
    -- Background
    drawRect(widgetId, x, y, width, height, "#333333", "#000000")
    
    -- Health fill
    local fillWidth = (current / max) * width
    drawGradient(widgetId, x, y, fillWidth, height, "#00ff00", "#008800", "horizontal")
    
    -- Text overlay
    local text = string.format("%d/%d", current, max)
    drawTextAligned(widgetId, text, x, y, width, height, "center", "12px Arial", "#ffffff")
end
```

### Drawing a Sprite
```lua
-- Load sprite sheet once
preloadImage("/images/sprites.png")

-- Draw specific sprite (32x32 sprites in a grid)
function drawSprite(widgetId, spriteX, spriteY, destX, destY)
    drawImagePart(widgetId, 
        "/images/sprites.png",
        destX, destY, 32, 32,  -- destination
        spriteX * 32, spriteY * 32, 32, 32  -- source
    )
end
```

## Compatibility

This API is designed to provide functionality equivalent to or exceeding:
- MUSHclient's WindowDraw* functions
- Mudlet's drawing capabilities
- Modern web canvas features

The key advantage over MUSHclient is the ability to combine transparency with transformations (rotation, scaling) in a single operation.