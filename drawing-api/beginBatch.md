# beginBatch

Begins batching draw operations for improved performance. All drawing commands between `beginBatch` and `endBatch` are queued and executed together.

## Syntax

```lua
beginBatch(widgetId)
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| widgetId | string | The ID of the canvas widget to batch operations for | Yes |

## Description

This function starts a batch operation mode where multiple drawing commands are collected and executed as a single operation. This significantly improves performance when drawing many elements, as it:

- Reduces rendering overhead
- Minimizes canvas state changes
- Allows for optimizations in the rendering pipeline
- Prevents intermediate rendering flashes

All drawing operations after `beginBatch` are queued until `endBatch` is called.

## Return Value

None

## Examples

### Basic Batching
```lua
-- Draw multiple shapes efficiently
beginBatch(widgetId)

-- Draw 100 random circles
for i = 1, 100 do
    local x = math.random(0, 400)
    local y = math.random(0, 300)
    local radius = math.random(5, 20)
    local color = string.format("#%02x%02x%02x", 
        math.random(0, 255), 
        math.random(0, 255), 
        math.random(0, 255))
    
    drawCircle(widgetId, x, y, radius, color, "#000000")
end

endBatch(widgetId)
```

### Particle System
```lua
local particles = {}

-- Initialize particles
function initParticles(count)
    for i = 1, count do
        table.insert(particles, {
            x = 200,
            y = 150,
            vx = math.random(-5, 5),
            vy = math.random(-10, -5),
            size = math.random(2, 5),
            color = string.format("rgba(255, %d, 0, %.2f)", 
                math.random(100, 255), 
                math.random() * 0.5 + 0.5),
            life = 1.0
        })
    end
end

-- Update and draw particles
function updateParticles(widgetId)
    clearWidget(widgetId)
    
    beginBatch(widgetId)
    
    for i = #particles, 1, -1 do
        local p = particles[i]
        
        -- Update physics
        p.x = p.x + p.vx
        p.y = p.y + p.vy
        p.vy = p.vy + 0.5  -- Gravity
        p.life = p.life - 0.02
        
        -- Remove dead particles
        if p.life <= 0 then
            table.remove(particles, i)
        else
            -- Draw particle
            drawCircle(widgetId, p.x, p.y, p.size * p.life, p.color)
        end
    end
    
    endBatch(widgetId)
end

-- Create particle effect
initParticles(50)
local particleTimer = addTimer(50, function()
    updateParticles(widgetId)
    -- Add new particles
    if #particles < 30 then
        initParticles(5)
    end
end, true)
```

### Starfield Background
```lua
function drawStarfield(widgetId, stars)
    beginBatch(widgetId)
    
    for _, star in ipairs(stars) do
        -- Vary star appearance based on properties
        if star.twinkle > 0.5 then
            local alpha = 0.3 + star.twinkle * 0.7
            local color = string.format("rgba(255, 255, 255, %.2f)", alpha)
            drawCircle(widgetId, star.x, star.y, star.size, color)
        else
            drawCircle(widgetId, star.x, star.y, star.size, "#ffffff")
        end
    end
    
    endBatch(widgetId)
end

-- Generate starfield
local stars = {}
for i = 1, 200 do
    table.insert(stars, {
        x = math.random(0, 400),
        y = math.random(0, 300),
        size = math.random() < 0.9 and 1 or 2,
        twinkle = math.random()
    })
end

drawStarfield(widgetId, stars)
```

### Grid-based Game Board
```lua
function drawGameBoard(widgetId, board, tileSize)
    beginBatch(widgetId)
    
    for row = 1, #board do
        for col = 1, #board[row] do
            local tile = board[row][col]
            local x = (col - 1) * tileSize
            local y = (row - 1) * tileSize
            
            -- Draw tile background
            local bgColor = ((row + col) % 2 == 0) and "#D2691E" or "#F4A460"
            drawRect(widgetId, x, y, tileSize, tileSize, bgColor)
            
            -- Draw tile content
            if tile.piece then
                drawImagePart(widgetId, 
                    "/images/pieces.png",
                    x + 2, y + 2, tileSize - 4, tileSize - 4,
                    tile.piece.type * 32, tile.piece.color * 32, 32, 32
                )
            end
            
            -- Draw selection highlight
            if tile.selected then
                drawRect(widgetId, x, y, tileSize, tileSize, nil, "#FFFF00")
            end
        end
    end
    
    endBatch(widgetId)
end

-- Create 8x8 chess-like board
local board = {}
for row = 1, 8 do
    board[row] = {}
    for col = 1, 8 do
        board[row][col] = {
            piece = nil,
            selected = false
        }
    end
end

drawGameBoard(widgetId, board, 40)
```

### Complex UI Rendering
```lua
function drawUI(widgetId, player)
    beginBatch(widgetId)
    
    -- Health bar
    drawRect(widgetId, 10, 10, 200, 20, "#333333", "#000000")
    local healthWidth = (player.health / player.maxHealth) * 200
    drawGradient(widgetId, 10, 10, healthWidth, 20, "#00ff00", "#008800", "horizontal")
    drawText(widgetId, player.health .. "/" .. player.maxHealth, 15, 25, "12px Arial", "#ffffff")
    
    -- Mana bar
    drawRect(widgetId, 10, 35, 200, 20, "#333333", "#000000")
    local manaWidth = (player.mana / player.maxMana) * 200
    drawGradient(widgetId, 10, 35, manaWidth, 20, "#0066ff", "#003388", "horizontal")
    drawText(widgetId, player.mana .. "/" .. player.maxMana, 15, 50, "12px Arial", "#ffffff")
    
    -- Status icons
    local iconX = 10
    for _, status in ipairs(player.statusEffects) do
        drawImageAlpha(widgetId, status.icon, iconX, 60, 24, 24, status.active and 1.0 or 0.3)
        iconX = iconX + 28
    end
    
    -- Inventory slots
    for i = 1, 10 do
        local slotX = 10 + (i - 1) * 35
        drawRect(widgetId, slotX, 90, 32, 32, "#444444", "#222222")
        
        if player.inventory[i] then
            drawImage(widgetId, player.inventory[i].icon, slotX + 2, 92, 28, 28)
            if player.inventory[i].count > 1 then
                drawText(widgetId, tostring(player.inventory[i].count), 
                    slotX + 20, 118, "10px Arial", "#ffffff")
            end
        end
    end
    
    endBatch(widgetId)
end
```

### Animated Loading Screen
```lua
function drawLoadingAnimation(widgetId, progress, frame)
    beginBatch(widgetId)
    
    -- Background
    drawRect(widgetId, 0, 0, 400, 300, "#222222")
    
    -- Progress bar
    drawRect(widgetId, 50, 140, 300, 20, "#444444", "#666666")
    drawGradient(widgetId, 50, 140, 300 * progress, 20, "#00ff00", "#008800", "horizontal")
    
    -- Spinning elements
    local centerX, centerY = 200, 100
    for i = 0, 7 do
        local angle = (i / 8) * math.pi * 2 + frame * 0.1
        local x = centerX + math.cos(angle) * 30
        local y = centerY + math.sin(angle) * 30
        local alpha = 0.3 + 0.7 * ((i + frame) % 8) / 7
        local color = string.format("rgba(100, 200, 255, %.2f)", alpha)
        drawCircle(widgetId, x, y, 5, color)
    end
    
    -- Loading text
    drawTextAligned(widgetId, "Loading... " .. math.floor(progress * 100) .. "%", 
        0, 170, 400, 30, "center", "16px Arial", "#ffffff")
    
    endBatch(widgetId)
end

-- Animate loading screen
local loadProgress = 0
local animFrame = 0
local loadTimer = addTimer(50, function()
    drawLoadingAnimation(widgetId, loadProgress, animFrame)
    loadProgress = loadProgress + 0.01
    animFrame = animFrame + 1
    
    if loadProgress >= 1 then
        removeTimer(loadTimer)
    end
end, true)
```

## Nested Batching

Batching operations cannot be nested. If `beginBatch` is called while already in a batch, it should be ignored or throw an error:

```lua
-- WRONG - Don't do this
beginBatch(widgetId)
drawRect(widgetId, 0, 0, 100, 100, "#ff0000")
beginBatch(widgetId)  -- This will be ignored or error
drawCircle(widgetId, 50, 50, 25, "#00ff00")
endBatch(widgetId)
endBatch(widgetId)

-- CORRECT - Single batch level
beginBatch(widgetId)
drawRect(widgetId, 0, 0, 100, 100, "#ff0000")
drawCircle(widgetId, 50, 50, 25, "#00ff00")
endBatch(widgetId)
```

## Performance Comparison

```lua
-- Without batching (SLOW)
function drawManyShapesNoBatch(widgetId, count)
    local startTime = getCurrentTime()
    
    for i = 1, count do
        drawCircle(widgetId, math.random(0, 400), math.random(0, 300), 5, "#ff0000")
    end
    
    local elapsed = getCurrentTime() - startTime
    echo("No batch: " .. elapsed .. "ms for " .. count .. " shapes")
end

-- With batching (FAST)
function drawManyShapesBatched(widgetId, count)
    local startTime = getCurrentTime()
    
    beginBatch(widgetId)
    for i = 1, count do
        drawCircle(widgetId, math.random(0, 400), math.random(0, 300), 5, "#ff0000")
    end
    endBatch(widgetId)
    
    local elapsed = getCurrentTime() - startTime
    echo("Batched: " .. elapsed .. "ms for " .. count .. " shapes")
end
```

## Best Practices

1. **Always pair with endBatch**: Every `beginBatch` must have a corresponding `endBatch`
2. **Batch similar operations**: Group related drawing operations together
3. **Don't batch single operations**: Overhead isn't worth it for 1-2 draw calls
4. **Clear before batching**: If redrawing entire scene, clear first:
   ```lua
   clearWidget(widgetId)
   beginBatch(widgetId)
   -- Draw everything
   endBatch(widgetId)
   ```

## Error Handling

```lua
-- Safe batching with error handling
function safeBatchDraw(widgetId, drawFunction)
    local success, error = pcall(function()
        beginBatch(widgetId)
        drawFunction()
        endBatch(widgetId)
    end)
    
    if not success then
        -- Ensure batch is ended even on error
        pcall(function() endBatch(widgetId) end)
        echo("Drawing error: " .. tostring(error), "#ff0000")
    end
end
```

## Notes

- Batched operations are executed in the order they were called
- Canvas state changes (blend modes, clipping) are included in the batch
- Very large batches may still cause performance issues
- Some operations may not benefit from batching (already optimized)

## See Also

- [endBatch](./endBatch.md) - End batch operations
- [clearWidget](./clearWidget.md) - Clear canvas before drawing
- [setRenderHint](./setRenderHint.md) - Optimize rendering quality