# Patent Infringement Checker

[Live Demo](https://patlytics.vercel.app/)

This Patent Checker app leverages `large language model (LLM)` AI technology to determine if a specific company and its products may infringe on a given patent. By incorporating `fuzzy search`, it helps users identify relevant results even when search keywords contain minor errors or variations. The app also offers `localStorage` for client-side data saving, allowing users to retain their search results without re-querying. Additionally, `node-cache` is used server-side to store frequently accessed data, significantly reducing LLM processing costs and improving response times.

### Key Features
- Patent Infringement Analysis: The application checks products against specific patents, listing claims that might be at issue.
- Fuzzy Search: Utilizes fuzzy search to match product names closely related to patent claims.
- Report Saving & Retrieval: Users can save analysis results for later review, with saved data stored in localStorage.

### Technologies Used
- Next.js: Provides a streamlined developer experience with Server Actions for efficient server communication.
- TypeScript: Ensures type safety and easier debugging.
- ESLint: A linter tool used to enforce coding standards and catch potential errors.
- Prettier: A code formatter that ensures consistent styling across the codebase.
- Tailwind CSS: Enables a modern, dark-themed, responsive design with custom hover and transition effects.
- OpenAI API: Utilizes large language models (LLMs) to analyze potential patent infringement.
- LangChain: Streamlines interactions with the OpenAI API, enabling structured output and enhancing the patent-checking process.
- node-cache: Implements caching for fast access to frequently accessed patent data.
- Local Storage: Saves user data for report management and persistence.
- Docker: Simplifies deployment, allowing the app to run consistently across different environments.

### Getting Started
#### Clone the Repository:
```
git clone https://github.com/patrickkuei/patlytics.git
```

#### Install Dependencies:
```
npm install
```

#### Run the Application:
```
npm run dev
```

#### Run in Docker:

Install Docker on your machine.

Build your container: 
```
docker build -t patlytics-docker .
```
Run your container:
```
docker run -p 3000:3000 patlytics-docker
```
Make sure you have the environment variable `API_KEY` set for the OpenAI API. You can set it in a .env file in your project root, like this:
```
API_KEY=your_actual_api_key
```

### Usage
#### Check for Patent Infringement:

Enter a product name and patent ID to check for potential infringement.

#### Save and View Reports:

Save the analysis result and view saved reports in the Saved Results section.

#### Cached Data Management:

Cached patent information enables faster load times for previously accessed data.