# measureText

Measures the dimensions of text before rendering, allowing for precise text positioning and layout calculations.

## Syntax

```lua
measureText(text, font)
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| text | string | The text string to measure | Yes |
| font | string | CSS font string (e.g., "16px Arial") | Yes |

## Description

This function calculates the width and approximate height of a text string when rendered with a specific font. This is essential for:
- Centering text precisely
- Word wrapping
- Creating text-based UI elements
- Ensuring text fits within boundaries
- Aligning multiple text elements

## Return Value

Returns a table with two fields:
- `width` (number): The width of the text in pixels
- `height` (number): The approximate height of the text in pixels

## Examples

### Basic Usage
```lua
-- Measure simple text
local dimensions = measureText("Hello World", "16px Arial")
print(string.format("Width: %d, Height: %d", dimensions.width, dimensions.height))

-- Measure with different fonts
local title = measureText("Game Title", "32px Georgia bold")
local subtitle = measureText("Press Start", "14px Courier")
```

### Centered Text
```lua
function drawCenteredText(widgetId, text, x, y, width, height, font, color)
    local textSize = measureText(text, font)
    
    -- Calculate centered position
    local textX = x + (width - textSize.width) / 2
    local textY = y + (height - textSize.height) / 2 + textSize.height * 0.8  -- Baseline adjustment
    
    drawText(widgetId, text, textX, textY, font, color)
end

-- Draw perfectly centered text in a box
drawRect(widgetId, 50, 50, 200, 100, "#333333", "#000000")
drawCenteredText(widgetId, "Centered!", 50, 50, 200, 100, "24px Arial", "#ffffff")
```

### Word Wrapping
```lua
function wrapText(text, maxWidth, font)
    local words = {}
    for word in text:gmatch("%S+") do
        table.insert(words, word)
    end
    
    local lines = {}
    local currentLine = ""
    
    for _, word in ipairs(words) do
        local testLine = currentLine == "" and word or currentLine .. " " .. word
        local lineSize = measureText(testLine, font)
        
        if lineSize.width <= maxWidth then
            currentLine = testLine
        else
            if currentLine ~= "" then
                table.insert(lines, currentLine)
            end
            currentLine = word
        end
    end
    
    if currentLine ~= "" then
        table.insert(lines, currentLine)
    end
    
    return lines
end

-- Draw wrapped text
function drawWrappedText(widgetId, text, x, y, maxWidth, font, color, lineSpacing)
    lineSpacing = lineSpacing or 1.2
    local lines = wrapText(text, maxWidth, font)
    local lineHeight = measureText("M", font).height * lineSpacing
    
    for i, line in ipairs(lines) do
        drawText(widgetId, line, x, y + (i - 1) * lineHeight, font, color)
    end
end

-- Example usage
local longText = "This is a very long text that needs to be wrapped to fit within a specific width on the screen."
drawWrappedText(widgetId, longText, 10, 10, 200, "14px Arial", "#ffffff")
```

### Text Button with Padding
```lua
function drawTextButton(widgetId, text, x, y, font, padding, bgColor, textColor)
    padding = padding or 10
    
    -- Measure text
    local textSize = measureText(text, font)
    
    -- Calculate button size
    local buttonWidth = textSize.width + padding * 2
    local buttonHeight = textSize.height + padding * 2
    
    -- Draw button background
    drawRect(widgetId, x, y, buttonWidth, buttonHeight, bgColor, "#000000")
    
    -- Draw centered text
    local textX = x + padding
    local textY = y + padding + textSize.height * 0.8
    drawText(widgetId, text, textX, textY, font, textColor)
    
    return {x = x, y = y, width = buttonWidth, height = buttonHeight}
end

-- Create buttons with dynamic sizing
drawTextButton(widgetId, "OK", 50, 100, "16px Arial", 15, "#4CAF50", "#ffffff")
drawTextButton(widgetId, "Cancel", 50, 150, "16px Arial", 15, "#f44336", "#ffffff")
drawTextButton(widgetId, "Apply Changes", 50, 200, "16px Arial", 15, "#2196F3", "#ffffff")
```

### Text Truncation with Ellipsis
```lua
function drawTruncatedText(widgetId, text, x, y, maxWidth, font, color)
    local textSize = measureText(text, font)
    
    if textSize.width <= maxWidth then
        -- Text fits, draw normally
        drawText(widgetId, text, x, y, font, color)
    else
        -- Text too long, truncate with ellipsis
        local ellipsis = "..."
        local ellipsisSize = measureText(ellipsis, font)
        local availableWidth = maxWidth - ellipsisSize.width
        
        -- Binary search for the right truncation point
        local low, high = 0, #text
        local truncateAt = 0
        
        while low <= high do
            local mid = math.floor((low + high) / 2)
            local testText = text:sub(1, mid)
            local testSize = measureText(testText, font)
            
            if testSize.width <= availableWidth then
                truncateAt = mid
                low = mid + 1
            else
                high = mid - 1
            end
        end
        
        local truncatedText = text:sub(1, truncateAt) .. ellipsis
        drawText(widgetId, truncatedText, x, y, font, color)
    end
end

-- Draw text with automatic truncation
drawTruncatedText(widgetId, "This is a very long filename that might not fit.txt", 
    10, 250, 150, "12px Arial", "#ffffff")
```

### Multi-Column Layout
```lua
function drawMultiColumnText(widgetId, items, x, y, columnWidth, font, color)
    local columnSpacing = 20
    local lineHeight = measureText("M", font).height * 1.5
    local currentX = x
    local currentY = y
    local maxY = y
    
    for _, item in ipairs(items) do
        local itemSize = measureText(item, font)
        
        -- Check if item fits in current column
        if currentY + lineHeight > y + 200 then  -- Column height limit
            currentX = currentX + columnWidth + columnSpacing
            currentY = y
        end
        
        -- Draw item
        drawText(widgetId, item, currentX, currentY, font, color)
        currentY = currentY + lineHeight
        maxY = math.max(maxY, currentY)
    end
    
    return {width = currentX + columnWidth - x, height = maxY - y}
end

-- Draw items in columns
local items = {
    "Sword of Fire", "Shield of Ice", "Helm of Thunder",
    "Boots of Speed", "Ring of Power", "Amulet of Life",
    "Cloak of Shadows", "Gauntlets of Strength"
}
drawMultiColumnText(widgetId, items, 10, 300, 120, "12px Arial", "#ffffff")
```

### Font Size Auto-Fit
```lua
function drawAutoSizedText(widgetId, text, x, y, maxWidth, maxHeight, fontFamily, color)
    local fontSize = 48  -- Start with large size
    local minFontSize = 8
    local font, textSize
    
    -- Find the largest font size that fits
    repeat
        font = fontSize .. "px " .. fontFamily
        textSize = measureText(text, font)
        fontSize = fontSize - 1
    until (textSize.width <= maxWidth and textSize.height <= maxHeight) or fontSize <= minFontSize
    
    -- Draw with the calculated font size
    drawCenteredText(widgetId, text, x, y, maxWidth, maxHeight, font, color)
    
    return font
end

-- Auto-size text to fit in different boxes
drawRect(widgetId, 250, 50, 100, 50, "#444444", "#000000")
drawAutoSizedText(widgetId, "LEVEL UP!", 250, 50, 100, 50, "Arial bold", "#ffff00")
```

### Text Metrics Helper
```lua
function getDetailedTextMetrics(text, font)
    local metrics = measureText(text, font)
    
    -- Extract font size from font string
    local fontSize = tonumber(font:match("(%d+)px")) or 16
    
    return {
        width = metrics.width,
        height = metrics.height,
        fontSize = fontSize,
        lineHeight = metrics.height * 1.2,
        baseline = metrics.height * 0.8,
        ascent = metrics.height * 0.7,
        descent = metrics.height * 0.3
    }
end

-- Use detailed metrics for precise positioning
local metrics = getDetailedTextMetrics("Typography", "24px Georgia")
```

## Font String Format

The font parameter follows CSS font syntax:
```
"[style] [variant] [weight] size family"
```

Examples:
- `"16px Arial"`
- `"bold 24px Georgia"`
- `"italic 14px 'Times New Roman'"`
- `"bold italic 18px Courier"`

## Performance Tips

1. **Cache measurements** for frequently used text:
   ```lua
   local textCache = {}
   function getCachedTextSize(text, font)
       local key = text .. "|" .. font
       if not textCache[key] then
           textCache[key] = measureText(text, font)
       end
       return textCache[key]
   end
   ```

2. **Measure once, use multiple times** when drawing the same text

3. **Batch similar measurements** to reduce overhead

## Notes

- Height calculation is approximate and based on font size
- Actual rendered height may vary slightly depending on the font
- For pixel-perfect layouts, test with your specific fonts
- Some special characters may affect measurements
- Very long strings may impact performance

## See Also

- [drawText](./drawText.md) - Basic text drawing
- [drawTextAligned](./drawTextAligned.md) - Draw aligned text
- [drawTextWithShadow](./drawTextWithShadow.md) - Draw text with shadows