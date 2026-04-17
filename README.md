# [TG BOT - Ai editor](https://t.me/HW2315_bot)

AI editor - this bot can edit your text for improvement readability.

<img src="example/messages - 1.jpg" alt="screenshot" width="70%"/>

## Developer section
NOTICE! The server location could be in Russia because Gigachat 
is not working correctly from other locations. Solution can be 
used VPN only for Telegram connections.
### Docker
```sh
sudo docker build --no-cache -t tg-bot_ai-editor .
sudo docker run \
    -v .env:/usr/local/app/.env \
    tg-bot_ai-editor
```
### Build native
1. Define your .env
    1. Get a bot token from the BotFather
    2. Get a GigaChat token from the sber studio.
2. Install the TLS certification issued by the [Russian Minestry](https://www.gosuslugi.ru/crt).
3. Install dependencies using `yarn install -D`
4. Run `yarn build && yarn start`
