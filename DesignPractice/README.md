[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/82qibl2u)
## DMIT1530: Assignment 2

This assignment is an idividual exercise worth 15% of your overall mark. 

For the complete rubric and Figma wireframe, please refer to your course section's Moodle instance. 

The following instructions will help you work through the image preparation, HTML, and CSS required to create this website.

## Introduction

This Assignment is a single-page responsive website about a ficticious tartan mill in Glasgow, UK. 

The following techniques and concepts will be covered: 

- embedded (or custom), external, and system fonts

- flex-grow, flex-shrink, and flex-basis

- the position property and its helper properties (top, left, bottom, right)

- z-index and stacking order

- multi-level navigation with dropdown menus

- mobile toggle or hamburger menus

- concepts previously covered in this course, including current best practices for the web


## Fonts

### Chronicle Display

Chronicle Display is a custom font (which will become an embedded font in your website’s styles subdirectory). The original Open Type font files (.otf files) are available on Moodle.

In order to use it in Figma, make sure to install the font file on your system. Next, follow the steps in this article: https://help.figma.com/hc/en-us/articles/360039956894-Add-a-font-to-Figma-design

Note: if you are using Figma in a browser, you will need to download the Figma Font Installer. This is covered in the article above.


### Libre Franklin

Libre Franklin is a Google Font, which can be added to your website via generated `<link>` elements in the `<head>` of your HTML.

To ensure that everything renders properly, you should download and install this font family from Google Fonts.


## Hover, Active, & Focus States

Upon hover: 

- All links without a button class have a hover state where an underline is added.

- All faux-button links have a red background with white text.

- All navigation icons and their labels have a red stroke and red text colour.


## Miscellaneous Notes

Layout spacing and distances are measured in half or whole root ephemeral units, following a 16px base system.

Although you may use the size of each frame to determine the minimum widths for your media queries, it is ultimately a judgement call (i.e. you may use different widths if you feel they better serve the provided content).


### Typography

Heading sizes will change in specific breakpoints or media queries. 

Pay close attention to the line heights of various text blocks, as they differ between elements (i.e. not every typographic element uses a line-height of 1.5).


### Localisation

Be mindful of spellings and localisation details. Because this is a website for a Scottish business, Scots Leid and British (en-gb) spellings should not be ‘corrected’. 

All currency should be in the British pound (£), also known as pound sterling. The HTML character entity is: `&pound;`
