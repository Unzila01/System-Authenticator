# Node.js and MySQL Authenticator

## Installation

To set up the project locally:
1. Clone the repository:
    ```bash
    git clone https://github.com/Unzila01/System-Authenticator.git
    ```

2. Navigate to the project directory:
    ```bash
    cd System-Authenticator
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Set up the database:
        MySQL Database: Created a MySQL database named lambda.
        Table signup:
        Fields:
        id (int): Primary key for user identification.
        email (varchar): Stores user email addresses.
        password (varchar): Stores hashed passwords for user accounts.

5. Create a `.env` file in the root directory and add your configuration:
    ```env
    DATABASE = your_database_name
    HOST = your_database_host
    USER = your_database_user
    PASSWORD = your_database_password
    JWT_SECRET = your_secret_key
    GOOGLE_CLIENT_ID = your_google_client_id
    GOOGLE_CLIENT_SECRET = your_google_client_secret
    GITHUB_CLIENT_ID = your_github_client_id
    GITHUB_CLIENT_SECRET = your_github_client_secret

6. Start the application:
    ```bash
    npm start
    ```

## Usage

- Access the application at `http://localhost:5000`.
- Sign up with your email and password.
- Use Google or GitHub to log in via OAuth.
