# AI Video Interface Concept

**[View the Repository on GitHub](https://github.com/eric-park1/hedra-composer-frontend)**

## 🚀 How to Download & Run

To run this project locally, follow these steps:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/eric-park1/hedra-composer-frontend.git](https://github.com/eric-park1/hedra-composer-frontend.git)
    ```

2.  **Navigate to the project directory**
    ```bash
    cd hedra-composer-frontend
    ```

3.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Introduction

AI video generation tools often ask users to express rich, cinematic ideas through a single text prompt — a format that struggles to capture visual intent. This project proposes a new interface that gives users direct, intuitive control over visual components, without sacrificing the freedom and playfulness that make AI creation fun.

The goal is to bridge the gap between user intent and the model’s interpretative capability, creating a workflow that feels predictable, iterative, and creatively empowering.

## Goals

This interface is designed to:

* **Bridge the gap between intent and capability:** Help users articulate their creative vision through visual controls and structured prompts.
* **Preserve trust through predictability:** Ensure the output aligns with expectations, reducing “failed” generations.
* **Align perception with performance:** Present model constraints transparently, so users see them as creative parameters — not limitations.

## Insight: The Missing Structure in AI Video

Every video composition can be described through definable elements:
* Lighting
* Scene
* Subject
* Objects
* Perspective

Current AI systems treat these as an undifferentiated whole. Yet emerging tools like **SAM2** (motion segmentation) and **Depth Anything** (depth & 3D perception) show how AI is learning to disentangle these moving parts. This progress suggests a future where users can adjust individual components of a composition instead of rewriting entire prompts.

### The Interface Gap in Current AI Tools
Most text-to-video interfaces rely on a single prompt box — a design that oversimplifies video creation. It ignores spatial and cinematic decisions like camera placement, depth, and framing, resulting in unpredictable outputs.

Even when users get close to their goal, there’s no iterative refinement. A small mistake forces a full regeneration, erasing progress and breaking creative flow. Over time, this unpredictability erodes trust and makes experimentation feel risky rather than inspiring.

## The Toolbox

This interface introduces modular, expandable tools — each targeting a controllable layer of composition. These tools offer editable, visual feedback loops rather than opaque text prompts.

* **Lighting Tool**
* **Scene Tool**
* **Perspective Tool**
* **Subject/Object Tool**

Each element can be refined independently, and future model improvements can plug directly into this structure without redesigning the overall interaction.

## 🎨 UI Workflow

We have mapped out the interaction logic and user flow in FigJam to visualize how the different tools connect.

![UI Workflow](./docs/UIWorkflow.png)

> **[Click here to view the live FigJam board](https://www.figma.com/board/T8jaC6izbnxp6fyRqjk7mP/Untitled?node-id=0-1&t=X8Rz4ZJYmGZGuqK4-1)**

### Deep Dive: The Perspective Tool
When a user opens the Perspective Tool, they’re not rewriting a prompt — they’re adjusting the virtual camera.

1.  The user selects a new camera angle.
2.  The model generates three **preview images** reflecting possible perspectives.
3.  The user chooses one and defines a basic camera motion (e.g., dolly in/out).
4.  The model uses that motion to predict the end frame — the key input for video generation.

This preview-based workflow lets users validate composition before processing a full video.

**Limitations:**
Preview generation can’t yet account for every dynamic in motion (subject reshaping, lighting shifts, or untracked occlusions). However, these previsualizations establish a practical bridge between human intent and model execution.

## Product Principles

### 1. Guidance Over Unboundedness
The interface replaces an empty text field with structured, visual inputs. Constraints become creative guidance, not restrictions.

### 2. Future-Proof Design
As AI models gain precision, new controls (e.g., for motion, physics, or cinematography) can slot into the existing toolset without changing user habits.

### 3. Efficiency Through Previsualization
Previews allow users to correct composition issues early — before costly video generation begins.

## Workflow Example

**User:** Market Strategist
**Goal:** Create a user-generated-style ad with multiple angles of the same subject.

| **Traditional Process** | **With the New Interface** |
| :--- | :--- |
| Generates multiple clips via text prompts. | Generates one master composition. |
| Discards most due to framing inconsistencies or hallucinated details. | Applies alternate perspectives to timeline segments directly in-editor. |
| Reassembles usable segments in a separate video editor. | Refines local elements (e.g., lighting, depth) without restarting. Exports seamlessly. |
| **Result:** High token waste, broken creative rhythm, unpredictable results. | **Result:** Iterative creativity without destruction — each action builds on the last. |

## Closing Vision

This system redefines video generation from a gamble to a craft. By turning abstract prompts into spatial decisions, it lets creators move from “hoping for the right result” to “designing toward it.”

As models evolve, this interface is ready to grow with them — not by reinventing the workflow, but by continuously enriching the user’s vocabulary of control.