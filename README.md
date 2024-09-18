# Telegram Bot Scheduler

This project is a Telegram bot that allows users to schedule messages to be sent to a channel after a specified delay.

## Features
- Schedule messages to be sent to a channel after a specified delay.
- Add channels to the bot.
- Retrieve channel information and invite links.

## Technologies Used
- TypeScript
- Node.js
- Telegraf (Telegram Bot Framework)
- MongoDB

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/telegram-bot-scheduler.git
    cd telegram-bot-scheduler
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```plaintext
    BOT_TOKEN=your_telegram_bot_token
    MONGODB_URI=your_mongodb_connection_string
    ```

## Usage

1. Start the bot:
    ```sh
    npm start
    ```

2. Interact with the bot on Telegram:
    - Use `/start` to begin.
    - Use `/add_channel` to add a channel.
    - Use `/schedule_task` to schedule a message.
    - Use `/get_channel_link` to get the channel invite link.
    - Use `/get_channel_info` to get information about the channel.

## Project Structure

- `src/`
    - `handlers/`: Contains bot command handlers.
    - `services/`: Contains business logic for the bot.
    - `config/`: Configuration files.
    - `index.ts`: Entry point of the application.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.