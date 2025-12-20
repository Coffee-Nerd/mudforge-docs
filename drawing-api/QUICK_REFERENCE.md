# Drawing API Quick Reference

## Basic Shapes
```lua
drawLine(widgetId, x1, y1, x2, y2, color?, width?)
drawRect(widgetId, x, y, width, height, fillColor?, strokeColor?)
drawCircle(widgetId, x, y, radius, fillColor?, strokeColor?)
drawEllipse(widgetId, x, y, radiusX, radiusY, fillColor?, strokeColor?)
drawPolygon(widgetId, points, fillColor?, strokeColor?)
drawArc(widgetId, x, y, radius, startAngle, endAngle, fillColor?, strokeColor?)
```

## Text Rendering
```lua
drawText(widgetId, text, x, y, font?, color?)
drawTextAligned(widgetId, text, x, y, width, height, alignment, font?, color?)
drawTextWithShadow(widgetId, text, x, y, font, color, shadowColor, shadowOffsetX, shadowOffsetY)
measureText(text, font) → {width, height}
```

## Image Operations
```lua
drawImage(widgetId, imageUrl, x, y, width?, height?)
drawImageAlpha(widgetId, imageUrl, x, y, width, height, alpha, tintColor?)
drawImagePart(widgetId, imageUrl, destX, destY, destWidth, destHeight, srcX, srcY, srcWidth, srcHeight)
drawImageRotated(widgetId, imageUrl, x, y, width, height, angle, centerX?, centerY?)
preloadImage(imageUrl) → Promise
```

## Gradients
```lua
drawGradient(widgetId, x, y, width, height, color1, color2, direction)
drawRadialGradient(widgetId, x, y, radius, innerColor, outerColor)
```

## Canvas Operations
```lua
clearWidget(widgetId)
setClipRegion(widgetId, x, y, width, height)
resetClipRegion(widgetId)
setBlendMode(widgetId, mode)
saveCanvas(widgetId)
restoreCanvas(widgetId)
getCanvasWidth() → number
getCanvasHeight() → number
getCanvasSize() → {width, height}
```

## Pixel Operations
```lua
getPixel(widgetId, x, y) → {r, g, b, a}
setPixel(widgetId, x, y, r, g, b, a?)
```

## Performance
```lua
beginBatch(widgetId)
endBatch(widgetId)
setRenderHint(widgetId, hint, enabled)
```

## Common Patterns

### Drawing a Health Bar
```lua
function drawHealthBar(widgetId, x, y, w, h, current, max)
    drawRect(widgetId, x, y, w, h, "#333333", "#000000")
    local fillW = (current / max) * w
    drawGradient(widgetId, x, y, fillW, h, "#00ff00", "#008800", "horizontal")
    drawTextAligned(widgetId, current.."/"..max, x, y, w, h, "center", "12px Arial", "#ffffff")
end
```

### Drawing from Sprite Sheet
```lua
function drawSprite(widgetId, sheet, col, row, x, y, size)
    drawImagePart(widgetId, sheet, x, y, size, size, 
        col * size, row * size, size, size)
end
```

### Batch Drawing Multiple Elements
```lua
beginBatch(widgetId)
for i = 1, 100 do
    drawCircle(widgetId, math.random(0, 400), math.random(0, 300), 5, "#ff0000")
end
endBatch(widgetId)
```

### Rotating Image with Alpha
```lua
-- Draw semi-transparent rotated image
saveCanvas(widgetId)
setBlendMode(widgetId, "normal")
drawImageAlpha(widgetId, imageUrl, x, y, w, h, 0.5)
-- Note: For rotation with alpha, you may need to combine operations
restoreCanvas(widgetId)
```

## Color Formats
- Hex: `"#ff0000"` or `"#f00"`
- RGB: `"rgb(255, 0, 0)"`
- RGBA: `"rgba(255, 0, 0, 0.5)"`
- Named: `"red"`, `"blue"`, etc.

## Blend Modes
- `"normal"` - Default
- `"multiply"` - Darkens
- `"screen"` - Lightens
- `"overlay"` - Contrast
- `"darken"` - Keeps darker pixels
- `"lighten"` - Keeps lighter pixels
- `"color-dodge"` - Brightens
- `"color-burn"` - Darkens with contrast
- `"hard-light"` - Strong contrast
- `"soft-light"` - Subtle contrast
- `"difference"` - Inverts based on difference
- `"exclusion"` - Similar to difference but lower contrast

## Render Hints
- `"antialiasing"` - Smooth edges
- `"smoothing"` - Image smoothing
- `"pixelated"` - Pixel art mode

## Angles
- All angles are in radians
- 0 = right, π/2 = down, π = left, 3π/2 = up
- Convert degrees to radians: `degrees * (math.pi / 180)`

## Performance Tips
1. Use `beginBatch()`/`endBatch()` for multiple operations
2. Preload images with `preloadImage()`
3. Cache `measureText()` results
4. Clear and redraw vs. partial updates
5. Use appropriate render hints for your content type