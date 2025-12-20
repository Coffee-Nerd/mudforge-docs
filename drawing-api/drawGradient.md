# drawGradient

Draws a linear gradient fill in a rectangular area. Gradients smoothly transition between two colors.

## Syntax

```lua
drawGradient(widgetId, x, y, width, height, color1, color2, direction)
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| widgetId | string | The ID of the canvas widget to draw on | Yes |
| x | number | X coordinate of the gradient rectangle | Yes |
| y | number | Y coordinate of the gradient rectangle | Yes |
| width | number | Width of the gradient rectangle | Yes |
| height | number | Height of the gradient rectangle | Yes |
| color1 | string | Starting color of the gradient | Yes |
| color2 | string | Ending color of the gradient | Yes |
| direction | string | Gradient direction: "horizontal", "vertical", or "diagonal" | Yes |

## Description

This function creates a smooth color transition between two colors across a rectangular area. The gradient can flow in three directions:
- **horizontal**: Left to right (color1 to color2)
- **vertical**: Top to bottom (color1 to color2)
- **diagonal**: Top-left to bottom-right (color1 to color2)

## Return Value

None

## Examples

### Basic Gradients
```lua
-- Horizontal gradient from red to blue
drawGradient(widgetId, 10, 10, 200, 50, "#ff0000", "#0000ff", "horizontal")

-- Vertical gradient from white to black
drawGradient(widgetId, 10, 70, 200, 50, "#ffffff", "#000000", "vertical")

-- Diagonal gradient from green to yellow
drawGradient(widgetId, 10, 130, 200, 50, "#00ff00", "#ffff00", "diagonal")
```

### Health Bar with Gradient
```lua
function drawHealthBar(widgetId, x, y, width, height, current, max)
    -- Draw background
    drawRect(widgetId, x, y, width, height, "#222222", "#000000")
    
    -- Calculate fill width
    local fillWidth = (current / max) * width
    
    -- Draw gradient fill based on health percentage
    local percent = current / max
    local color1, color2
    
    if percent > 0.5 then
        -- Green gradient for high health
        color1 = "#00ff00"
        color2 = "#00aa00"
    elseif percent > 0.25 then
        -- Yellow gradient for medium health
        color1 = "#ffff00"
        color2 = "#aaaa00"
    else
        -- Red gradient for low health
        color1 = "#ff0000"
        color2 = "#aa0000"
    end
    
    drawGradient(widgetId, x, y, fillWidth, height, color1, color2, "horizontal")
    
    -- Draw text overlay
    local text = string.format("%d/%d", current, max)
    drawTextAligned(widgetId, text, x, y, width, height, "center", "12px Arial", "#ffffff")
end

-- Draw a health bar at 75% health
drawHealthBar(widgetId, 50, 200, 200, 20, 75, 100)
```

### Sky Background
```lua
function drawSkyGradient(widgetId, width, height, timeOfDay)
    local skyGradients = {
        dawn = { color1 = "#FFB6C1", color2 = "#87CEEB" },      -- Pink to light blue
        day = { color1 = "#87CEEB", color2 = "#4682B4" },       -- Light blue to steel blue
        dusk = { color1 = "#FF6347", color2 = "#483D8B" },      -- Tomato to dark slate blue
        night = { color1 = "#191970", color2 = "#000000" }      -- Midnight blue to black
    }
    
    local gradient = skyGradients[timeOfDay] or skyGradients.day
    drawGradient(widgetId, 0, 0, width, height, gradient.color1, gradient.color2, "vertical")
end

-- Draw a dusk sky
drawSkyGradient(widgetId, 400, 300, "dusk")
```

### Button with Gradient
```lua
function drawGradientButton(widgetId, x, y, width, height, text, pressed)
    local color1, color2
    
    if pressed then
        -- Inverted gradient for pressed state
        color1 = "#666666"
        color2 = "#999999"
    else
        -- Normal gradient
        color1 = "#cccccc"
        color2 = "#999999"
    end
    
    -- Draw gradient background
    drawGradient(widgetId, x, y, width, height, color1, color2, "vertical")
    
    -- Draw border
    drawRect(widgetId, x, y, width, height, nil, "#333333")
    
    -- Draw text
    drawTextAligned(widgetId, text, x, y, width, height, "center", "14px Arial", "#000000")
end

-- Draw normal and pressed buttons
drawGradientButton(widgetId, 50, 50, 100, 30, "Click Me", false)
drawGradientButton(widgetId, 160, 50, 100, 30, "Pressed", true)
```

### Progress Bar Collection
```lua
function drawProgressBars(widgetId)
    local bars = {
        { label = "HP", value = 80, max = 100, color1 = "#ff0000", color2 = "#800000" },
        { label = "MP", value = 45, max = 100, color1 = "#0000ff", color2 = "#000080" },
        { label = "XP", value = 250, max = 1000, color1 = "#ffff00", color2 = "#808000" },
        { label = "Stamina", value = 60, max = 100, color1 = "#00ff00", color2 = "#008000" }
    }
    
    local y = 10
    for _, bar in ipairs(bars) do
        -- Label
        drawText(widgetId, bar.label, 10, y + 5, "12px Arial", "#ffffff")
        
        -- Background
        drawRect(widgetId, 60, y, 200, 20, "#333333", "#000000")
        
        -- Gradient fill
        local fillWidth = (bar.value / bar.max) * 200
        drawGradient(widgetId, 60, y, fillWidth, 20, bar.color1, bar.color2, "horizontal")
        
        -- Value text
        local text = string.format("%d/%d", bar.value, bar.max)
        drawTextAligned(widgetId, text, 60, y, 200, 20, "center", "11px Arial", "#ffffff")
        
        y = y + 25
    end
end
```

### Metallic Surface Effect
```lua
function drawMetallicSurface(widgetId, x, y, width, height, baseColor)
    -- Create a metallic sheen effect with multiple gradients
    local halfHeight = height / 2
    
    -- Top half - light to base
    drawGradient(widgetId, x, y, width, halfHeight, 
        lightenColor(baseColor, 0.5), baseColor, "vertical")
    
    -- Bottom half - base to dark
    drawGradient(widgetId, x, y + halfHeight, width, halfHeight,
        baseColor, darkenColor(baseColor, 0.5), "vertical")
end

-- Helper functions for color manipulation
function lightenColor(color, amount)
    -- Simple implementation - in practice, use proper color manipulation
    return "#cccccc"  -- Placeholder
end

function darkenColor(color, amount)
    -- Simple implementation
    return "#666666"  -- Placeholder
end
```

### Multi-Stop Gradient Simulation
```lua
-- Simulate a multi-stop gradient by drawing multiple gradients
function drawRainbowBar(widgetId, x, y, width, height)
    local colors = {
        "#ff0000",  -- Red
        "#ff7f00",  -- Orange
        "#ffff00",  -- Yellow
        "#00ff00",  -- Green
        "#0000ff",  -- Blue
        "#4b0082",  -- Indigo
        "#9400d3"   -- Violet
    }
    
    local segmentWidth = width / (#colors - 1)
    
    beginBatch(widgetId)
    for i = 1, #colors - 1 do
        local segmentX = x + (i - 1) * segmentWidth
        drawGradient(widgetId, segmentX, y, segmentWidth, height,
            colors[i], colors[i + 1], "horizontal")
    end
    endBatch(widgetId)
end

-- Draw a rainbow gradient bar
drawRainbowBar(widgetId, 50, 250, 300, 30)
```

## Visual Effects

### Glossy Effect
```lua
function drawGlossyRect(widgetId, x, y, width, height, color)
    -- Base color
    drawRect(widgetId, x, y, width, height, color)
    
    -- Glossy overlay (top half)
    local glossHeight = height / 2
    drawGradient(widgetId, x, y, width, glossHeight,
        "rgba(255,255,255,0.3)", "rgba(255,255,255,0)", "vertical")
end
```

### Depth Shadow
```lua
function drawDepthShadow(widgetId, x, y, width, height)
    -- Draw shadow gradient
    drawGradient(widgetId, x + 2, y + 2, width, height,
        "rgba(0,0,0,0.3)", "rgba(0,0,0,0.1)", "diagonal")
    
    -- Draw main content on top
    drawRect(widgetId, x, y, width, height, "#ffffff", "#000000")
end
```

## Performance Tips

1. **Batch gradient operations** when drawing multiple gradients:
   ```lua
   beginBatch(widgetId)
   -- Draw multiple gradients
   endBatch(widgetId)
   ```

2. **Cache gradient calculations** for frequently used gradients

3. **Use solid colors** for better performance when gradients aren't necessary

## Notes

- Colors support all standard web formats: hex (#rgb, #rrggbb), rgb(), rgba()
- Gradients are rendered using the canvas 2D context's createLinearGradient
- For radial gradients, use [drawRadialGradient](./drawRadialGradient.md)
- Diagonal gradients go from top-left to bottom-right at a 45-degree angle

## See Also

- [drawRadialGradient](./drawRadialGradient.md) - Circular gradients
- [drawRect](./drawRect.md) - Solid color rectangles
- [setBlendMode](./setBlendMode.md) - Blend gradients with existing content