# PCBee
PCBee is a high-tech, AI-powered, easy-to-use PC part picker! A CPSC2350 Final Project 
The site uses eBay's API and GPT API to help make a simple PC part picker. Use the GPT API powered chatbot to ask and consult about your PC build.

# Project Objectives
To create an easy-to-use website powered by the latest AI technology to help build you a new PC. 
To help us learn proper SDLC methodologies, and apply it to a practical project.

# Tech Stacks
1. HTML
2. Bootstrap (CSS)
3. Node js
4. Render.com

# Contributors
1. Thomas Cheng
2. Matthew Widjaja
3. Gregory Bennett
4. Kevin Nguyen

# Development Environment Setup
This project requires Node js version 20.11.1 to run. Both APIs used in this project require authorization tokens to run properly that can be obtained in 2 separate ways:
- for eBay's API, it is required as per their policy to sign-in to the user's eBay account in the site.
- for GPT API, the token is completely private and is declared as an environment variable in Render's deployment.
Due to these reasons, running the project using localhost would require filling GPT API's token manually into the code, and completely impossible for eBay as it requires a HTTPS redirect after signing in, which localhost is not.

# Setup Instructions
Visit `https://pcbee.onrender.com/` to access the site. As the site is hosted on the free tier of Render, it will take a moment to load the site after inactivity. Please wait around 20 seconds for the site to boot up again. To run the test, either run `npm test` or `npx test` in the root directory. Please make sure to assign the API tokens before running the test. More details on the test file itself.  

To host locally, it is important to note that the project will be limited in features. Remember to install all dependencies using `npm install`. As said in the Development Environment Setup, running the project using localhost would require filling GPT API's token manually into the code, and completely impossible for eBay as it requires a HTTPS redirect after signing in, which localhost is not.

# Project Links
[Link to video demo, by Matthew Widjaja](https://www.youtube.com/watch?v=c3KX-QdsoXE&feature=youtu.be)
[Link to project report](./projectReport.pdf)
[Link to project presentation](./projectPresentation.pdf)
