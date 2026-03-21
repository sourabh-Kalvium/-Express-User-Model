# Creator's Platform API Postman Guide

This guide provides instructions on how to set up and use the Postman collection for testing the Creator's Platform API.

## Setup Instructions

1.  **Start the Backend**: Ensure your Express server is running locally (default: `http://localhost:5000`).
2.  **Open Postman**: Launch the Postman desktop application or web version.

## How to Import Collection

1.  Click the **Import** button in the top left of Postman.
2.  Drag and drop the file `docs/Creator's_Platform_API.postman_collection.json` into the import window.
3.  Confirm the import.

## How to Import Environment

1.  Click the **Import** button in the top left of Postman.
2.  Drag and drop the file `docs/Local_Development.postman_environment.json` into the import window.
3.  After importing, open the environment dropdown (top right) and select **Local Development**.

## Order of Running Requests

To test the full flow of the API, run the requests in the following order:

1.  **Health > Health Check**: Verify the server is responding.
2.  **Auth > Register User**: Create a new account. This will automatically save the JWT token to the `authToken` environment variable.
3.  **Auth > Login User**: (Optional) Log in with your credentials. This also updates the `authToken`.
4.  **Posts > Get All Posts**: View your posts (requires authentication).
5.  **Posts > Create Post**: Create a new post.
6.  **Posts > Update Post**: Update an existing post (paste the `_id` from a created post into the URL variable).
7.  **Posts > Delete Post**: Delete a post (paste the `_id` from a created post into the URL variable).

## Explanation of Variables

-   `{{baseURL}}`: The base URL of the API (e.g., `http://localhost:5000`).
-   `{{authToken}}`: The JWT token used for authenticated requests. It is automatically populated after a successful registration or login.

## Test Automation

The following requests include automated test scripts:
-   **Health Check**: Verifies 200 status and response structure.
-   **Register/Login**: Verifies success status and automatically extracts/saves the JWT token.
-   **Create Post**: Verifies 201 status and that the post data includes a valid ID.
