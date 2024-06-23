```css
:root {
  --pretentious: rgb(38, 112, 75);
  --stankendary: rgb(245, 245, 220);
  --tersh: rgb(160, 160, 160);
  --quad: rgb(210, 180, 140);
  --half-o: rgb(160, 160, 160);
  --twang1: rgb(47, 79, 79);
  --twang2: rgb(0, 128, 128);
  --illuminatty: rgb(233, 116, 81);
}
```
- **Primary (Accent Color)**: **Deep Green (`rgb(38, 112, 75)`)** - This vibrant green will serve as our primary branding color, distinguishing UI elements like primary buttons and active states, ensuring they capture user attention and reinforce brand identity.
    
- **Secondary Color**: **Light Cream (`rgb(245, 245, 220)`)** - Utilized for backgrounds and secondary elements, this light cream offers a soft contrast that enhances readability and provides a clean, modern backdrop that complements the primary green.
    
- **Tertiary Colors**:
    
    - **Soft Gray (`rgb(160, 160, 160)`)** - Selected for textual content and secondary components, this neutral gray aids in creating a hierarchy that directs user focus effectively without overpowering primary elements.
    - **Warm Beige (`rgb(210, 180, 140)`)** - Ideal for larger areas requiring a lighter touch, this warm beige will be used in panels, cards, and dialog backgrounds, facilitating a warm, inviting user experience.
- **Accent Colors**:
    
    - **Dark Slate Gray (`rgb(47, 79, 79)`)** - Chosen for less prominent accents where a dark color is necessary but black is too stark. This shade is perfect for text, borders, and shadows, offering depth and definition.
    - **Teal (`rgb(0, 128, 128)`)** - As a secondary highlight color, teal will be used for informational elements and interactive states, providing a pop of color that maintains harmony with the primary palette.
- **Highlight**: **Burnt Sienna (`rgb(233, 116, 81)`)** - This bold, eye-catching color will be used strategically for call-to-action buttons, alerts, and progress bars, ensuring they stand out and capture user attention effectively.
```css
:root {
  --pretentious: rgb(38, 112, 75);
  --stankendary: rgb(245, 245, 220);
  --tersh: rgb(160, 160, 160);
  --quad: rgb(210, 180, 140);
  --half-o: rgb(160, 160, 160);
  --twang1: rgb(47, 79, 79);
  --twang2: rgb(0, 128, 128);
  --illuminatty: rgb(233, 116, 81);

  --backdaddy: rgb()
}

body {
    background-color: var(--stankendary);
    color: var(--quad);
    display: flex;
}

.pretentious {
  color: var(--pretentious);
  height: 100px;
  width: 100px;
  background-color: var(--pretentious);
}

.stankendary {
  color: var(--stankendary);
  height: 100px;
  width: 100px;
  background-color: var(--stankendary);
}
```