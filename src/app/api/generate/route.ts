import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, GenerateResponseType } from "../../../types/schema";
import { STYLE_CONFIGS, Scene } from "../../../types/constants";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SCENE_TYPES = [
  "text-reveal",
  "logo-intro",
  "kinetic-typography",
  "shape-morph",
  "parallax",
  "slide-transition",
  "bounce-in",
  "fade-sequence",
  "lower-third",
  "social-callout",
  "infographic-chart",
  "animated-icon",
  "transition-effect",
  "product-showcase",
  "meme-effect",
  "reaction-popup",
  "number-counter",
  "speech-bubble",
  "typewriter",
  "timeline",
  "glitch-text",
  "vhs-overlay",
  "gradient-wave",
  "checklist",
  "device-mockup",
];

const STYLE_PRESETS = Object.keys(STYLE_CONFIGS);

// Detect if user wants a single specific animation type
function detectSingleAnimationType(prompt: string): string | null {
  const promptLower = prompt.toLowerCase().trim();

  // Check for explicit single scene requests
  if (/^(create|make|generate|show|display|animate|i want|i need)\s+(a|an|the)?\s*(single|one|just)\s+(scene|animation|effect)/i.test(prompt)) {
    // Extract the animation type from the prompt
    const animationMatch = promptLower.match(/(?:single|one|just)\s+(?:scene|animation|effect)?\s+([a-z\s-]+?)(?:\s+animation|\s+effect|\s+scene|$)/i);
    if (animationMatch) {
      const animationType = animationMatch[1].trim();
      // Map to scene types
      if (/counter|count/i.test(animationType)) return "number-counter";
      if (/logo/i.test(animationType)) return "logo-intro";
      if (/text\s+reveal|reveal/i.test(animationType)) return "text-reveal";
      // Add more mappings as needed
    }
  }

  // Map keywords to scene types (check longer phrases first)
  const animationKeywords: Record<string, string> = {
    "map animation": "infographic-chart",
    "map": "infographic-chart",
    "geographic": "infographic-chart",
    "country map": "infographic-chart",
    "world map": "infographic-chart",
    "pie chart": "infographic-chart",
    "bar chart": "infographic-chart",
    "bar graph": "infographic-chart",
    "line chart": "infographic-chart",
    "line graph": "infographic-chart",
    "donut chart": "infographic-chart",
    "infographic chart": "infographic-chart",
    "infographic": "infographic-chart",
    "chart": "infographic-chart",
    "graph": "infographic-chart",
    "data visualization": "infographic-chart",
    "visualization": "infographic-chart",
    "text counter": "number-counter",
    "number counter": "number-counter",
    "counter animation": "number-counter",
    "counter": "number-counter",
    "count": "number-counter",
    "logo intro": "logo-intro",
    "logo": "logo-intro",
    "text reveal": "text-reveal",
    "reveal": "text-reveal",
    "kinetic typography": "kinetic-typography",
    "kinetic": "kinetic-typography",
    "bounce in": "bounce-in",
    "bounce": "bounce-in",
    "fade sequence": "fade-sequence",
    "fade": "fade-sequence",
    "shape morph": "shape-morph",
    "morph": "shape-morph",
    "parallax": "parallax",
    "slide transition": "slide-transition",
    "slide": "slide-transition",
    "lower third": "lower-third",
    "social callout": "social-callout",
    "callout": "social-callout",
    "animated icon": "animated-icon",
    "icon": "animated-icon",
    "transition effect": "transition-effect",
    "transition": "transition-effect",
    "product showcase": "product-showcase",
    "product": "product-showcase",
    "meme effect": "meme-effect",
    "meme": "meme-effect",
    "reaction popup": "reaction-popup",
    "reaction": "reaction-popup",
    "speech bubble": "speech-bubble",
    "bubble": "speech-bubble",
    "typewriter": "typewriter",
    "timeline": "timeline",
    "glitch text": "glitch-text",
    "glitch": "glitch-text",
    "vhs overlay": "vhs-overlay",
    "vhs": "vhs-overlay",
    "gradient wave": "gradient-wave",
    "wave": "gradient-wave",
    "checklist": "checklist",
    "device mockup": "device-mockup",
    "mockup": "device-mockup",
  };

  // Check for exact matches first (longer phrases first, so "text counter" matches before "counter")
  // Sort by length (longest first) to match more specific phrases first
  const sortedKeywords = Object.entries(animationKeywords).sort((a, b) => b[0].length - a[0].length);

  // Exclude general animation terms that should allow multiple scenes
  const generalAnimationTerms = /^(amazing|awesome|cool|great|beautiful|stunning|epic|incredible|fantastic|wonderful|nice|good|best|premium|professional|high.?quality)\s+(animation|motion|graphic|video|effect|scene)/i;
  if (generalAnimationTerms.test(prompt)) {
    return null; // Allow multiple scenes for general animation requests
  }

  for (const [keyword, sceneType] of sortedKeywords) {
    // Check if the prompt contains the keyword as a standalone phrase
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(promptLower)) {
      // Check if it's a single animation request
      // Conditions for single scene (must be more specific):
      // 1. Contains explicit single keywords: "single", "one scene", "just"
      // 2. Pattern: "[specific animation type] animation/effect/scene" (not general terms)
      // 3. Pattern: "create/make/generate [specific animation type] animation/effect/scene"
      // 4. Short prompt (8 words or less) with specific animation type
      const wordCount = promptLower.split(/\s+/).length;
      const isShortPrompt = wordCount <= 8;
      const hasSingleKeywords = /single|one\s+scene|just\s+(a|an|the)?\s*(scene|animation|effect)/i.test(promptLower);
      const isAnimationPattern = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\s+(animation|effect|scene|video)\\b`, 'i').test(promptLower);
      const isDirectRequest = /^(create|make|generate|show|display|animate|i want|i need)\s+(a|an|the)?\s*[^.]*\s*(animation|effect|scene|video)$/i.test(prompt);

      // Exclude general descriptive terms
      const hasGeneralTerms = /amazing|awesome|cool|great|beautiful|stunning|epic|incredible|fantastic|wonderful|nice|good|best|premium|professional/i.test(promptLower);

      // If it has general terms, allow multiple scenes
      if (hasGeneralTerms && !hasSingleKeywords) {
        continue; // Skip this match, allow multiple scenes
      }

      // If it's a short prompt mentioning a specific animation type, treat as single scene
      if (isShortPrompt && isAnimationPattern && !hasGeneralTerms) {
        return sceneType;
      }

      if (hasSingleKeywords || (isDirectRequest && !hasGeneralTerms)) {
        return sceneType;
      }
    }
  }

  return null;
}

async function generateWithGemini(prompt: string, style?: string, duration?: number, aspectRatio?: string): Promise<GenerateResponseType> {
  if (!GEMINI_API_KEY) {
    // Fallback to smart defaults when no API key
    return generateFallback(prompt, style, duration, aspectRatio);
  }

  // Check if user wants a single specific animation
  const singleAnimationType = detectSingleAnimationType(prompt);
  const shouldCreateSingleScene = singleAnimationType !== null;

  // Analyze prompt for better understanding - prioritize chart/graph/map requests
  const isMap = /map|geographic|country|countries|world\s+map|europe|asia|africa|america|continent/i.test(prompt);
  const isChart = /pie\s+chart|bar\s+(chart|graph)|line\s+(chart|graph)|donut\s+chart|chart|graph|infographic|data\s+visualization|visualization/i.test(prompt);
  const isList = /list|items|checklist|tasks|steps|things|products/i.test(prompt) && !isChart && !isMap;
  const isSequence = /sequence|one by one|one at a time|individually|each|multiple|several/i.test(prompt);

  // Determine if this should be a cohesive single animation or multiple scenes
  // Charts and maps should always be single scene
  const shouldBeCohesive = isChart || isMap || isList || (isSequence && !shouldCreateSingleScene);

  const systemPrompt = `You are an elite motion graphics designer with 15+ years of experience creating premium animations for top brands. Your work rivals the best motion graphics templates on premium platforms like Motion Array, Envato, and VideoHive.

Your task: Analyze the user's prompt like a professional motion graphics designer and create a beautifully crafted, cohesive animation that tells a visual story.

Available scene types: ${SCENE_TYPES.join(", ")}
Available styles: ${STYLE_PRESETS.join(", ")}

CRITICAL ANALYSIS PRINCIPLES:
1. **Context Understanding**: Deeply analyze what the user wants to show
   - Maps/Geographic → ALWAYS use "infographic-chart" type in ONE scene
   - Map animations: Format countries as "Country1|Country2|Country3" or "Highlighted:Country1|Country2|Country3"
   - Charts/Graphs → ALWAYS use "infographic-chart" type in ONE scene
   - Pie charts, bar charts, bar graphs, line charts, line graphs → Use "infographic-chart" with data formatted as "Label1:Value1|Label2:Value2|Label3:Value3"
   - Lists/Items → Use "checklist" type to animate items sequentially
   - Multiple items/things → Create ONE cohesive scene that shows all items animating in sequence
   - Single concept → Use appropriate single animation type
   - Story/narrative → Create flowing scenes that build on each other

2. **Professional Animation Principles**:
   - Use smooth, professional easing (spring animations)
   - Create visual hierarchy and flow
   - Ensure animations feel premium and polished
   - Items should animate in sequence, not split across disconnected scenes
   - For lists: Show ALL items in ONE scene using checklist animation, not separate scenes

3. **Scene Structure**:
${shouldCreateSingleScene
      ? `   - Create ONLY ONE scene using "${singleAnimationType}" type`
      : isMap
        ? `   - For "${prompt}": Create ONE scene using "infographic-chart" type for map visualization
   - Extract countries/regions from the prompt (e.g., "France|Germany|Italy|Spain")
   - If a country is highlighted/emphasized, format as "Highlighted:France|Germany|Italy"
   - DO NOT use checklist, text-reveal, or other types - ONLY use infographic-chart for maps`
        : isChart
          ? `   - For "${prompt}": Create ONE scene using "infographic-chart" type
   - Format data as "Label1:Value1|Label2:Value2|Label3:Value3" (use | to separate segments)
   - For pie charts: Extract categories and values from the prompt (e.g., "Protein:30|Carbs:40|Fats:20|Fiber:10")
   - For bar graphs/line charts: Extract data points from context
   - DO NOT use checklist, text-reveal, or other types - ONLY use infographic-chart`
          : shouldBeCohesive
            ? `   - For "${prompt}": Create ONE cohesive scene that shows all items/elements animating in sequence
   - Use "checklist" type for lists/items to show them one by one in a single beautiful animation
   - DO NOT split items across multiple scenes - show them all in one flowing sequence`
            : `   - Create 3-6 scenes that flow together as a cohesive, amazing animation
   - Each scene should build on the previous one with smooth transitions
   - Use variety in animation types to create visual interest
   - Create a narrative flow that tells a story
   - Make it feel premium and polished like top-tier motion graphics templates
   - Avoid disconnected, random scenes - ensure they flow naturally`}

4. **Text Content**:
   - For maps: Format countries as "Country1|Country2|Country3" (e.g., "France|Germany|Italy|Spain")
   - For highlighted countries: Use "Highlighted:CountryName|OtherCountry1|OtherCountry2"
   - For charts/graphs: Format as "Label1:Value1|Label2:Value2|Label3:Value3" (e.g., "Protein:30|Carbs:40|Fats:20|Fiber:10")
   - For pie charts: Extract categories and percentages from the prompt context
   - For bar graphs/line charts: Extract data points and labels from context
   - For lists: Include ALL items separated by "|" (e.g., "Milk|Bread|Eggs|Cheese")
   - Extract meaningful content from the prompt
   - Make text relevant and contextual

5. **Visual Quality**:
   - Choose colors that match the mood and theme
   - Use professional color palettes
   - Ensure high visual appeal

Respond ONLY with valid JSON in this exact format:
{
  "title": "Descriptive title",
  "style": "one of the available styles",
  "colors": {
    "primary": "#hex color",
    "secondary": "#hex color", 
    "background": "#hex color",
    "text": "#hex color"
  },
  "scenes": [
    {
      "id": "scene-1",
      "type": "one of the scene types",
      "text": "Content text (use | to separate list items)",
      "duration": ${(duration || 10) * 30},
      "style": "style preset",
      "colors": { "primary": "#hex", "secondary": "#hex", "background": "#hex", "text": "#hex" },
      "animation": { "easing": "spring", "intensity": 0.8 }
    }
  ]
}

Duration: ${duration || 10} seconds = ${(duration || 10) * 30} frames total
${style ? `Style preference: "${style}"` : "Choose the most appropriate professional style"}

Remember: Think like a premium motion graphics designer. Create animations that would be featured on top template marketplaces.`;


  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `User prompt: ${prompt}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 3072,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return generateFallback(prompt, style, duration, aspectRatio);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return generateFallback(prompt, style, duration, aspectRatio);
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return generateFallback(prompt, style, duration, aspectRatio);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ...parsed,
      aspectRatio: (aspectRatio as "16:9" | "9:16" | "1:1" | "4:5") || "16:9",
    } as GenerateResponseType;
  } catch (error) {
    console.error("Gemini generation error:", error);
    return generateFallback(prompt, style, duration, aspectRatio);
  }
}

function generateFallback(prompt: string, style?: string, duration?: number, aspectRatio?: string): GenerateResponseType {
  const words = prompt.split(" ");
  const totalFrames = (duration || 10) * 30;
  const selectedStyle = style || "bold-modern";
  const styleConfig = STYLE_CONFIGS[selectedStyle as keyof typeof STYLE_CONFIGS] || STYLE_CONFIGS["bold-modern"];

  // Check if user wants a single specific animation
  const singleAnimationType = detectSingleAnimationType(prompt);

  // If single animation detected, create only one scene
  if (singleAnimationType) {
    // Extract text from prompt (remove animation type keywords)
    let sceneText = prompt;

    // Try to extract meaningful text, removing animation keywords
    const animationKeywords = ["counter", "number counter", "text counter", "animation", "effect", "scene", "video"];
    for (const keyword of animationKeywords) {
      sceneText = sceneText.replace(new RegExp(keyword, "gi"), "").trim();
    }

    // If no meaningful text left, use a default
    if (!sceneText || sceneText.length < 3) {
      sceneText = "1000+";
    }

    return {
      title: words.slice(0, 5).join(" ") || "Animation",
      style: selectedStyle,
      colors: styleConfig.colors,
      scenes: [
        {
          id: "scene-1",
          type: singleAnimationType,
          text: sceneText,
          duration: totalFrames,
          style: selectedStyle as Scene["style"],
          colors: styleConfig.colors,
          animation: { easing: "spring", intensity: 0.8 },
        },
      ],
      aspectRatio: (aspectRatio as "16:9" | "9:16" | "1:1" | "4:5") || "16:9",
    };
  }

  // Detect if this is a map request (highest priority)
  const isMap = /map|geographic|country|countries|world\s+map|europe|asia|africa|america|continent/i.test(prompt);

  if (isMap) {
    // Extract countries from prompt
    const countryRegex = /\b(france|germany|italy|spain|uk|united\s+kingdom|england|poland|netherlands|belgium|portugal|greece|austria|sweden|norway|denmark|finland|switzerland|ireland|czech|romania|hungary|bulgaria|croatia|slovakia|slovenia|estonia|latvia|lithuania|usa|united\s+states|america|canada|mexico|brazil|argentina|china|japan|india|russia|australia|south\s+korea|indonesia|thailand|vietnam|philippines|malaysia|singapore|south\s+africa|egypt|nigeria|kenya|morocco|tunisia|algeria|turkey|israel|saudi\s+arabia|uae|iran|iraq|pakistan|bangladesh|afghanistan|kazakhstan|uzbekistan|ukraine|belarus|moldova|georgia|armenia|azerbaijan)\b/gi;
    const countries = prompt.match(countryRegex) || [];

    // Check for highlighted/emphasized country
    const highlightedMatch = prompt.match(/(?:highlight|highlighted|emphasize|focus|show)\s+(?:on\s+)?([a-z\s]+?)(?:\s+country|\s+on|\s+map|$)/i);
    const highlightedCountry = highlightedMatch ? highlightedMatch[1].trim() : null;

    let mapData: string;

    if (countries.length > 0) {
      // Use countries found in prompt
      const uniqueCountries = Array.from(new Set(countries.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase())));
      if (highlightedCountry) {
        const highlighted = uniqueCountries.find(c => c.toLowerCase().includes(highlightedCountry.toLowerCase()) || highlightedCountry.toLowerCase().includes(c.toLowerCase()));
        if (highlighted) {
          mapData = `Highlighted:${highlighted}|${uniqueCountries.filter(c => c !== highlighted).join("|")}`;
        } else {
          mapData = `Highlighted:${highlightedCountry}|${uniqueCountries.join("|")}`;
        }
      } else {
        mapData = uniqueCountries.join("|");
      }
    } else if (/europe|european/i.test(prompt)) {
      // Default European countries
      mapData = highlightedCountry
        ? `Highlighted:${highlightedCountry}|Germany|Italy|Spain|UK|Poland|Netherlands|Belgium|Portugal|Greece`
        : "France|Germany|Italy|Spain|UK|Poland|Netherlands|Belgium|Portugal|Greece";
    } else {
      // Generic map
      mapData = highlightedCountry
        ? `Highlighted:${highlightedCountry}|Country1|Country2|Country3|Country4`
        : "Country1|Country2|Country3|Country4|Country5";
    }

    return {
      title: words.slice(0, 5).join(" ") || "Map Animation",
      style: selectedStyle,
      colors: styleConfig.colors,
      scenes: [
        {
          id: "scene-1",
          type: "infographic-chart",
          text: mapData,
          duration: totalFrames,
          style: selectedStyle as Scene["style"],
          colors: styleConfig.colors,
          animation: { easing: "spring", intensity: 0.8 },
        },
      ],
      aspectRatio: (aspectRatio as "16:9" | "9:16" | "1:1" | "4:5") || "16:9",
    };
  }

  // Detect if this is a chart/graph request (priority check)
  const isChart = /pie\s+chart|bar\s+(chart|graph)|line\s+(chart|graph)|donut\s+chart|chart|graph|infographic|data\s+visualization|visualization/i.test(prompt);

  if (isChart) {
    // Extract chart data from prompt or create default based on context
    let chartData: string;

    if (/diet|nutrition|food|meal|protein|carbs|fat|fiber|vitamin/i.test(prompt)) {
      // Diet/nutrition pie chart
      chartData = "Protein:30|Carbs:40|Fats:20|Fiber:10";
    } else if (/budget|finance|money|expense|income|spending/i.test(prompt)) {
      // Budget/finance chart
      chartData = "Housing:40|Food:20|Transport:15|Entertainment:15|Savings:10";
    } else if (/sales|revenue|profit|business|market/i.test(prompt)) {
      // Business chart
      chartData = "Q1:25|Q2:30|Q3:20|Q4:25";
    } else {
      // Generic chart data
      chartData = "Category A:35|Category B:25|Category C:20|Category D:20";
    }

    return {
      title: words.slice(0, 5).join(" ") || "Chart Animation",
      style: selectedStyle,
      colors: styleConfig.colors,
      scenes: [
        {
          id: "scene-1",
          type: "infographic-chart",
          text: chartData,
          duration: totalFrames,
          style: selectedStyle as Scene["style"],
          colors: styleConfig.colors,
          animation: { easing: "spring", intensity: 0.8 },
        },
      ],
      aspectRatio: (aspectRatio as "16:9" | "9:16" | "1:1" | "4:5") || "16:9",
    };
  }

  // Detect if this is a list/items animation
  const isList = /list|items|checklist|tasks|steps|things|products/i.test(prompt) && !isChart && !isMap;
  const isGrocery = /grocery|shopping|food/i.test(prompt);
  const isSequence = /sequence|one by one|one at a time|individually|each|multiple|several|animate/i.test(prompt);

  // If it's a list/items animation, create ONE cohesive checklist scene
  if (isList || (isSequence && !singleAnimationType)) {
    let listItems: string;

    if (isGrocery) {
      // Default grocery items
      listItems = "Milk|Bread|Eggs|Cheese|Fruits|Vegetables|Meat|Rice";
    } else {
      // Try to extract items from prompt or use generic items
      const promptWords = words.filter(w =>
        w.length > 2 &&
        !/the|of|a|an|and|or|for|with|from|to|in|on|at|by|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|may|might|must|can/i.test(w.toLowerCase())
      );

      if (promptWords.length >= 3) {
        listItems = promptWords.slice(0, 6).join("|");
      } else {
        listItems = "Item 1|Item 2|Item 3|Item 4|Item 5";
      }
    }

    return {
      title: words.slice(0, 5).join(" ") || "List Animation",
      style: selectedStyle,
      colors: styleConfig.colors,
      scenes: [
        {
          id: "scene-1",
          type: "checklist",
          text: listItems,
          duration: totalFrames,
          style: selectedStyle as Scene["style"],
          colors: styleConfig.colors,
          animation: { easing: "spring", intensity: 0.8 },
        },
      ],
      aspectRatio: (aspectRatio as "16:9" | "9:16" | "1:1" | "4:5") || "16:9",
    };
  }

  // Smart scene generation based on prompt analysis (multiple scenes)
  const isIntro = /intro|welcome|hello|start|begin/i.test(prompt);
  const isEnergetic = /energy|fast|dynamic|exciting|sale|discount/i.test(prompt);
  const isElegant = /elegant|luxury|premium|sophisticated/i.test(prompt);
  const isTech = /tech|digital|future|ai|code|software|app|device/i.test(prompt);
  const isSocial = /subscribe|like|follow|share|comment|bell/i.test(prompt);
  const isData = /stats|data|growth|chart|number|percent|counter|million|billion/i.test(prompt);
  const isProduct = /product|launch|new|introducing|showcase|phone|device/i.test(prompt);
  const isMeme = /wait|boom|wow|omg|viral|crazy|reaction/i.test(prompt);
  const isRetro = /retro|vhs|vintage|80s|90s|glitch/i.test(prompt);
  const isExplainer = /how|step|guide|tutorial|explain/i.test(prompt);
  const isTimeline = /timeline|history|journey|process|stages/i.test(prompt);

  const scenes: Scene[] = [];
  let frameOffset = 0;

  // Opening scene - smart selection based on content type
  let openingType: string;
  let openingIntensity = 0.7;

  if (isSocial) {
    openingType = "social-callout";
    openingIntensity = 0.9;
  } else if (isMeme) {
    openingType = "meme-effect";
    openingIntensity = 1.0;
  } else if (isRetro) {
    openingType = "vhs-overlay";
    openingIntensity = 0.8;
  } else if (isData) {
    openingType = "infographic-chart";
    openingIntensity = 0.8;
  } else if (isExplainer) {
    openingType = "text-reveal";
    openingIntensity = 0.7;
  } else if (isIntro) {
    openingType = "logo-intro";
    openingIntensity = 0.8;
  } else if (isEnergetic) {
    openingType = "bounce-in";
    openingIntensity = 0.9;
  } else {
    openingType = "kinetic-typography";
    openingIntensity = 0.7;
  }

  scenes.push({
    id: "scene-1",
    type: openingType,
    text: words.slice(0, 4).join(" "),
    duration: Math.floor(totalFrames * 0.35),
    style: selectedStyle as Scene["style"],
    colors: styleConfig.colors,
    animation: { easing: "spring", intensity: openingIntensity },
  });
  frameOffset = Math.floor(totalFrames * 0.35);

  // Middle scene(s)
  if (words.length > 4) {
    let midType: string;
    if (isData) midType = "number-counter";
    else if (isTimeline) midType = "timeline";
    else if (isExplainer) midType = "checklist";
    else if (isProduct) midType = "device-mockup";
    else if (isRetro) midType = "glitch-text";
    else if (isTech) midType = "typewriter";
    else if (isElegant) midType = "fade-sequence";
    else midType = "gradient-wave";

    scenes.push({
      id: "scene-2",
      type: midType,
      text: words.slice(4, 8).join(" ") || words.slice(0, 4).join(" "),
      duration: Math.floor(totalFrames * 0.35),
      style: selectedStyle as Scene["style"],
      colors: styleConfig.colors,
      animation: { easing: "spring", intensity: 0.8 },
    });
    frameOffset += Math.floor(totalFrames * 0.35);
  }

  // Closing scene
  scenes.push({
    id: `scene-${scenes.length + 1}`,
    type: isEnergetic ? "slide-transition" : "parallax",
    text: words.slice(-4).join(" ") || prompt,
    duration: totalFrames - frameOffset,
    style: selectedStyle as Scene["style"],
    colors: styleConfig.colors,
    animation: { easing: "spring", intensity: 0.7 },
  });

  return {
    title: words.slice(0, 5).join(" "),
    style: selectedStyle,
    colors: styleConfig.colors,
    scenes,
    aspectRatio: (aspectRatio as "16:9" | "9:16" | "1:1" | "4:5") || "16:9",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = GenerateRequest.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { prompt, style, duration, aspectRatio } = parsed.data;
    const result = await generateWithGemini(prompt, style, duration, aspectRatio);

    // Include aspect ratio in response
    return NextResponse.json({
      ...result,
      aspectRatio: aspectRatio || "16:9",
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate motion graphics" },
      { status: 500 }
    );
  }
}
