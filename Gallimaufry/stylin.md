Given the following zod schemas and types:

```ts
import { z } from "zod";
export const COLOR_MODES = [  
  "lighter",  
  "light",  
  "main",  
  "dark",  
  "darker",  
  "contrastText",  
] as const;  
export const zColorMode = z.enum(COLOR_MODES);  
export type ColorMode = z.infer<typeof zColorMode>;  
  
export const zPrimaryColorModes = z.record(zPrimaryColor, z.record(zColorMode, zHexColor));  
export type PrimaryColorModes = z.infer<typeof zPrimaryColorModes>;
```

Would it be possible to calculate the `lighter`, `light`, `main`, `dark`, `darker`, and `contrastText` using some kind of equation for something like:
```ts
const primaryColors = {  
  "cyan": {  
    "lighter": "#CCF4FE",  
    "light": "#68CDF9",  
    "main": "#078DEE",  
    "dark": "#0351AB",  
    "darker": "#012972",  
    "contrastText": "#FFFFFF"  
  },  
  "purple": {  
    "lighter": "#EBD6FD",  
    "light": "#B985F4",  
    "main": "#7635dc",  
    "dark": "#431A9E",  
    "darker": "#200A69",  
    "contrastText": "#FFFFFF"  
  },  
  "blue": {  
    "lighter": "#CDE9FD",  
    "light": "#6BB1F8",  
    "main": "#0C68E9",  
    "dark": "#063BA7",  
    "darker": "#021D6F",  
    "contrastText": "#FFFFFF"  
  },  
  "orange": {  
    "lighter": "#FEF4D4",  
    "light": "#FED680",  
    "main": "#fda92d",  
    "dark": "#B66816",  
    "darker": "#793908",  
    "contrastText": "#1C252E"  
  },  
  "red": {  
    "lighter": "#FFE3D5",  
    "light": "#FFC1AC",  
    "main": "#FF3030",  
    "dark": "#B71833",  
    "darker": "#7A0930",  
    "contrastText": "#FFFFFF"  
  }  
}
```

---
Given the following types and zod schemas:
```ts
export const CHANNEL_NUMS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;  
export const zChannelNum = z.enum(CHANNEL_NUMS);  
export type ChannelNum = z.infer<typeof zChannelNum>;  
  
const zColorChannel = z.custom<`${ChannelNum}Channel`>((val) => /^(50|[1-9]00)Channel$/.test(val as string));  
export type ColorChannel = z.infer<typeof zColorChannel>;
```

I want to create a function called `createPalleteChannel` which functionally works the same as:
```ts
export function createPaletteChannel(hexPalette: Record<string, string>) {  
  const channelPalette: Record<string, string> = {};  
  
  Object.entries(hexPalette).forEach(([key, value]) => {  
    channelPalette[`${key}Channel`] = hexToRgbChannel(value);  
  });  
  
  return { ...hexPalette, ...channelPalette };  
}
```

But with the return type typed as the template literal: 
```ts
type PaletteChannelOptions = `${ChannelNum}Channel`
```