<h1>SPOT The Ball</h1>

<h2>Description</h2>
<p>This is a simple web-based game called Spot The Ball.</p> 
<p>A user is shown a sporting photograph where the ball has been digitally removed. The user must click on the image to mark where they believe the ball should be.</p>
<p>An email will be sent to the user confirming their entry to the game with the prize they have selected. Then a leaderboard with the top 10 players with the highest score will be displayed.</p>
<h2>Tech stack choices</h2>
<h3>Frontend</h3>
Reactjs + Vite(Typescript): Provides efficient library for building UIs and establish connection using APIs.
Bootstrap: Boost the process of improving UI layout and design.
<h3>Backend</h3>
Python + FastApi: Provides the fastest frameworks for building APIs and establish connection with the database.
<h3>Database</h3>
SQLITE: Provides the simplest and fastest storage for users with just one database file in the server without any configurations.
<h3>Deployment</h3>
Render: Entirely free source to deploy the server online with easy process of linking to Github account.

<h2>Architecture overview</h2>
<img width="1019" height="587" alt="image" src="https://github.com/user-attachments/assets/f984de73-4856-4dd7-9043-5245abb48ca9" />

<h2>Known limitations</h2>
<p>The user cannot go back once selected their prize.</p>
<p>The user cannot receive email when the server is running on Render.</p>

<h2>What you would do next with more time?</h2>
<p>I would upload my code to Github at the start before implementing the project, because Github can track the process of my code which enables me to reverse back to previous commits. It can restore code if my local device is destroyed.</p> 
<p>I would choose an alternate deployment server instead of Render, because Render does not support SMTP protocol for email sending.</p>

