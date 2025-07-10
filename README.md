# Comic Strip Generator

A React-based web application for generating comic strips using AI image generation (DALL-E).

## Version
v0.0.2-alpha (Pre-alpha, stable)

## Features
- AI-powered image generation using DALL-E 2
- Multi-frame comic strip creation
- Customizable text prompts for each frame
- Local storage for saving work in progress
- Modern, responsive UI built with React and TailwindCSS

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

## Setup
1. Clone the repository:
```bash
git clone [your-repo-url]
cd comic-strip-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Development
- Built with React 18 and TypeScript
- Uses TailwindCSS for styling
- OpenAI's DALL-E 2 for image generation
- Local storage for project persistence

## Configuration
- Default image size: 512x512 (development)
- DALL-E model: dall-e-2 (configurable via environment variable)
- Development port: 3000

## Current Status
This is a pre-alpha version (v0.0.2) with basic functionality:
- ✅ Basic UI implementation
- ✅ DALL-E integration
- ✅ Image generation
- ✅ Multi-frame support
- ✅ Local storage
- ❌ Google Drive integration (planned)
- ❌ Advanced frame editing (planned)
- ❌ Export options (planned)

## Contributing
This project is in early development. Contributions are welcome!

## License
[Your License Here] 