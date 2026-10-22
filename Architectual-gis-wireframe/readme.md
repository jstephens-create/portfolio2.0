# Architectural GIS Wireframe

## Concept

This folder explores the relationship between architecture, geographic information systems (GIS), computational geometry, and interactive visual design.

The primary architectural reference is Chicago's Willis Tower, with the possibility of expanding into other Chicago skyscrapers.

The goal is to develop a three-dimensional architectural representation that visitors can rotate through 360 degrees, inspect, and understand spatially.

## Visual Direction

The references in this folder inform the visual language of the experiment.

Explore:
- Architectural wireframes and structural geometry.
- Swiss International Typographic Style and technical drawing conventions.
- Coordinate systems, grids, measurement labels, and spatial relationships.
- Minimal color, precise linework, and restrained interaction.
- Geometrically meaningful animation rather than decorative movement.

Do not directly reproduce the reference images. Interpret their underlying design principles.

## Technical Exploration

Investigate appropriate uses of:

- Three.js and WebGL for interactive 3D rendering.
- GIS and GeoJSON for geographic positioning and building footprints.
- Blender for architectural modeling when necessary.
- glTF/GLB for optimized 3D assets.
- OrbitControls for rotation, zooming, and inspection.

Distinguish verified GIS data from reconstructed architectural details and artistic interpretation.

## Interaction Goals

The initial prototype should allow visitors to:

1. Rotate a wireframe model of Willis Tower through 360 degrees.
2. Zoom and inspect its structural proportions.
3. View relevant architectural information through labels or annotations.
4. Understand the relationship between the building's form and its geographic context.

## Design Constraints

Avoid generic futuristic interfaces, arbitrary particle effects, excessive glow, and animation without informational purpose.

Prioritize architectural accuracy, clarity, performance, and visual experimentation.

## Development Approach

Treat this folder as a creative and technical reference, not a complete implementation specification.

Before coding, inspect the references, identify technical requirements, propose an achievable prototype, and explain the intended geometry and interaction.

Do not create files, install dependencies, or modify unrelated parts of the repository without approval.

## Architectural Data Sources and Modeling References

### 1. Chicago Geographic Data
**Chicago Data Portal — Building Footprints**  
https://data.cityofchicago.org/

Use the city's building footprint datasets to locate and investigate Chicago skyscrapers. Search for Willis Tower and inspect the geographic outline.

**OpenStreetMap**  
https://www.openstreetmap.org/

Use as an additional geographic reference for building locations, footprints, and available building attributes.

### 2. Architectural Reference
**CTBUH — Skyscraper Center**  
https://www.skyscrapercenter.com/

Research verified building heights, architectural characteristics, and structural information for Willis Tower.

**Chicago Architecture Center**  
https://www.architecture.org/

Research the architectural history and bundled-tube structural system of Willis Tower.

### 3. Three-Dimensional Modeling
**Three.js Documentation**  
https://threejs.org/docs/

Use Three.js to render the architectural geometry, edges, camera, lighting, and interactive 3D scene.

**Three.js OrbitControls**  
https://threejs.org/docs/#examples/en/controls/OrbitControls

Use orbit controls for 360-degree rotation, zooming, and spatial inspection.

**Blender**  
https://www.blender.org/

Use Blender when the architectural model requires more detailed geometric construction.

**glTF Specification**  
https://www.khronos.org/gltf/

Use glTF/GLB to exchange and optimize 3D building assets.

### 4. GIS Tools
**QGIS**  
https://qgis.org/

Use QGIS to inspect geographic coordinates, building footprints, and spatial datasets.

**MapLibre GL JS**  
https://maplibre.org/

Consider MapLibre for future integration with an interactive geographic map of Chicago.

## Instructions for Claude Code

Before attempting to model Willis Tower:

1. Examine all reference images in this folder.
2. Research the architectural and GIS sources listed above.
3. Identify the building's geographic footprint, height, stepped profile, and bundled-tube structural configuration.
4. Distinguish verified measurements from approximations.
5. Determine whether the available information supports procedural modeling or requires a separate 3D asset.
6. Propose how the geographic footprint can be transformed into three-dimensional geometry.
7. Explain which information each visual element represents.
8. Request approval before implementing the model.

Do not assume that a GIS building footprint contains a complete 3D building model.

Do not fabricate architectural measurements or present approximations as verified data.

The objective is an interactive architectural reconstruction grounded in research, not a visually similar but geographically inaccurate sculpture.

