# drawPolygon

Draws a polygon shape from an array of points. This allows creating complex shapes like triangles, hexagons, stars, and irregular polygons.

## Syntax

```lua
drawPolygon(widgetId, points, fillColor, strokeColor)
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| widgetId | string | The ID of the canvas widget to draw on | Yes |
| points | Array<{x: number, y: number}> | Array of point objects defining the polygon vertices | Yes |
| fillColor | string | Color to fill the polygon (null for no fill) | No |
| strokeColor | string | Color for the polygon outline (null for no stroke) | No |

## Description

This function draws a polygon by connecting a series of points. The polygon is automatically closed by connecting the last point back to the first. You can create any shape by specifying the appropriate vertices.

## Return Value

None

## Examples

### Basic Shapes
```lua
-- Draw a triangle
local triangle = {
    {x = 100, y = 50},
    {x = 50, y = 150},
    {x = 150, y = 150}
}
drawPolygon(widgetId, triangle, "#ff0000", "#000000")

-- Draw a diamond
local diamond = {
    {x = 200, y = 50},
    {x = 250, y = 100},
    {x = 200, y = 150},
    {x = 150, y = 100}
}
drawPolygon(widgetId, diamond, "#00ff00", "#000000")

-- Draw a hexagon
local hexagon = {}
local centerX, centerY = 300, 100
local radius = 50
for i = 0, 5 do
    local angle = (i * math.pi * 2) / 6
    table.insert(hexagon, {
        x = centerX + radius * math.cos(angle),
        y = centerY + radius * math.sin(angle)
    })
end
drawPolygon(widgetId, hexagon, "#0000ff", "#ffffff")
```

### Star Shape
```lua
function drawStar(widgetId, centerX, centerY, points, outerRadius, innerRadius, fillColor, strokeColor)
    local vertices = {}
    local angleStep = (math.pi * 2) / points
    
    for i = 0, points - 1 do
        -- Outer point
        local outerAngle = i * angleStep - math.pi / 2
        table.insert(vertices, {
            x = centerX + outerRadius * math.cos(outerAngle),
            y = centerY + outerRadius * math.sin(outerAngle)
        })
        
        -- Inner point
        local innerAngle = outerAngle + angleStep / 2
        table.insert(vertices, {
            x = centerX + innerRadius * math.cos(innerAngle),
            y = centerY + innerRadius * math.sin(innerAngle)
        })
    end
    
    drawPolygon(widgetId, vertices, fillColor, strokeColor)
end

-- Draw a 5-pointed star
drawStar(widgetId, 150, 150, 5, 50, 20, "#ffff00", "#ff8800")

-- Draw an 8-pointed star
drawStar(widgetId, 300, 150, 8, 40, 20, "#ff00ff", "#8800ff")
```

### Arrow Shape
```lua
function drawArrow(widgetId, x, y, width, height, direction, color)
    local points = {}
    
    if direction == "right" then
        points = {
            {x = x, y = y + height * 0.25},
            {x = x + width * 0.6, y = y + height * 0.25},
            {x = x + width * 0.6, y = y},
            {x = x + width, y = y + height * 0.5},
            {x = x + width * 0.6, y = y + height},
            {x = x + width * 0.6, y = y + height * 0.75},
            {x = x, y = y + height * 0.75}
        }
    elseif direction == "up" then
        points = {
            {x = x + width * 0.25, y = y + height},
            {x = x + width * 0.25, y = y + height * 0.4},
            {x = x, y = y + height * 0.4},
            {x = x + width * 0.5, y = y},
            {x = x + width, y = y + height * 0.4},
            {x = x + width * 0.75, y = y + height * 0.4},
            {x = x + width * 0.75, y = y + height}
        }
    end
    -- Add more directions as needed
    
    drawPolygon(widgetId, points, color, darkenColor(color, 0.3))
end

-- Draw directional arrows
drawArrow(widgetId, 50, 200, 60, 30, "right", "#00ff00")
drawArrow(widgetId, 150, 200, 30, 60, "up", "#0088ff")
```

### Speech Bubble
```lua
function drawSpeechBubble(widgetId, x, y, width, height, tailX, tailY)
    -- Calculate rounded rectangle points (simplified)
    local radius = 10
    local points = {
        -- Top-left curve
        {x = x + radius, y = y},
        -- Top-right curve
        {x = x + width - radius, y = y},
        {x = x + width, y = y + radius},
        -- Right side
        {x = x + width, y = y + height - radius},
        -- Bottom-right curve
        {x = x + width - radius, y = y + height},
        -- Tail connection point
        {x = x + width * 0.7, y = y + height},
        -- Tail
        {x = tailX, y = tailY},
        -- Back to bubble
        {x = x + width * 0.5, y = y + height},
        -- Bottom-left curve
        {x = x + radius, y = y + height},
        {x = x, y = y + height - radius},
        -- Left side
        {x = x, y = y + radius}
    }
    
    drawPolygon(widgetId, points, "#ffffff", "#000000")
end

-- Draw a speech bubble with tail
drawSpeechBubble(widgetId, 50, 50, 150, 60, 100, 130)
```

### Irregular Terrain Shape
```lua
function drawMountain(widgetId, x, y, width, height, color)
    -- Generate random mountain peaks
    local points = {{x = x, y = y + height}}  -- Start at bottom-left
    
    local peaks = 3 + math.random(2)  -- 3-5 peaks
    for i = 1, peaks do
        local peakX = x + (width / peaks) * (i - 0.5) + math.random(-20, 20)
        local peakY = y + math.random(0, height * 0.6)
        table.insert(points, {x = peakX, y = peakY})
    end
    
    table.insert(points, {x = x + width, y = y + height})  -- Bottom-right
    
    drawPolygon(widgetId, points, color, darkenColor(color, 0.3))
end

-- Draw mountain range
drawMountain(widgetId, 0, 150, 100, 100, "#8B7355")
drawMountain(widgetId, 80, 160, 120, 90, "#A0826D")
drawMountain(widgetId, 180, 140, 100, 110, "#8B6F47")
```

### Health/Mana Orb
```lua
function drawOrb(widgetId, x, y, radius, fillPercent, fillColor, emptyColor)
    -- Create a circular polygon (approximated)
    local segments = 32
    local points = {}
    
    -- Calculate fill angle
    local fillAngle = fillPercent * math.pi * 2
    
    -- Draw filled portion
    local filledPoints = {{x = x + radius, y = y + radius}}  -- Center
    for i = 0, segments do
        local angle = (i / segments) * fillAngle - math.pi / 2
        if angle <= fillAngle - math.pi / 2 then
            table.insert(filledPoints, {
                x = x + radius + radius * math.cos(angle),
                y = y + radius + radius * math.sin(angle)
            })
        end
    end
    
    if #filledPoints > 2 then
        drawPolygon(widgetId, filledPoints, fillColor)
    end
    
    -- Draw orb outline
    for i = 0, segments do
        local angle = (i / segments) * math.pi * 2
        table.insert(points, {
            x = x + radius + radius * math.cos(angle),
            y = y + radius + radius * math.sin(angle)
        })
    end
    drawPolygon(widgetId, points, nil, "#000000")
end

-- Draw health orb at 75% full
drawOrb(widgetId, 250, 200, 40, 0.75, "#ff0000", "#330000")
```

### Radar/Mini-map Marker
```lua
function drawRadarBlip(widgetId, centerX, centerY, angle, distance, type)
    local markerSize = 6
    local x = centerX + math.cos(angle) * distance
    local y = centerY + math.sin(angle) * distance
    
    local shapes = {
        enemy = {  -- Triangle pointing up
            {x = x, y = y - markerSize},
            {x = x - markerSize/2, y = y + markerSize/2},
            {x = x + markerSize/2, y = y + markerSize/2}
        },
        ally = {  -- Diamond
            {x = x, y = y - markerSize},
            {x = x + markerSize, y = y},
            {x = x, y = y + markerSize},
            {x = x - markerSize, y = y}
        },
        item = {  -- Square
            {x = x - markerSize/2, y = y - markerSize/2},
            {x = x + markerSize/2, y = y - markerSize/2},
            {x = x + markerSize/2, y = y + markerSize/2},
            {x = x - markerSize/2, y = y + markerSize/2}
        }
    }
    
    local colors = {
        enemy = "#ff0000",
        ally = "#00ff00",
        item = "#ffff00"
    }
    
    drawPolygon(widgetId, shapes[type], colors[type], "#000000")
end

-- Draw radar with various blips
drawCircle(widgetId, 200, 200, 50, "#001100", "#00ff00")  -- Radar background
drawRadarBlip(widgetId, 200, 200, 0, 30, "enemy")         -- Enemy to the north
drawRadarBlip(widgetId, 200, 200, math.pi/2, 40, "ally")  -- Ally to the east
drawRadarBlip(widgetId, 200, 200, math.pi, 20, "item")    -- Item to the south
```

## Helper Functions

```lua
-- Generate regular polygon points
function getRegularPolygonPoints(sides, centerX, centerY, radius, rotation)
    rotation = rotation or 0
    local points = {}
    
    for i = 0, sides - 1 do
        local angle = (i * 2 * math.pi / sides) + rotation
        table.insert(points, {
            x = centerX + radius * math.cos(angle),
            y = centerY + radius * math.sin(angle)
        })
    end
    
    return points
end

-- Draw various regular polygons
local pentagon = getRegularPolygonPoints(5, 100, 300, 30)
drawPolygon(widgetId, pentagon, "#ff00ff", "#000000")

local octagon = getRegularPolygonPoints(8, 200, 300, 30, math.pi/8)
drawPolygon(widgetId, octagon, "#00ffff", "#000000")
```

## Performance Tips

1. **Simplify complex shapes** - Use fewer points when possible
2. **Batch polygon drawing**:
   ```lua
   beginBatch(widgetId)
   -- Draw multiple polygons
   endBatch(widgetId)
   ```
3. **Cache point calculations** for frequently drawn shapes
4. **Use rounded values** for pixel-perfect rendering

## Notes

- Points are connected in the order provided
- The polygon is automatically closed (last point connects to first)
- Both fill and stroke can be null/nil to skip filling or outlining
- Complex polygons with many points may impact performance
- Self-intersecting polygons may not render as expected

## See Also

- [drawLine](./drawLine.md) - Draw individual line segments
- [drawRect](./drawRect.md) - Draw rectangles
- [drawCircle](./drawCircle.md) - Draw circles
- [drawArc](./drawArc.md) - Draw arc segments
- [drawEllipse](./drawEllipse.md) - Draw ellipses