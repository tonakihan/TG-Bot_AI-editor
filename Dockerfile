FROM node:lts-alpine3.23

# Install Russian certificates
WORKDIR /usr/local/share/ca-certificates/russian
RUN wget https://gu-st.ru/content/lending/linux_russian_trusted_root_ca_pem.zip && \
    wget https://gu-st.ru/content/lending/russian_trusted_sub_ca_pem.zip && \
    unzip linux_russian_trusted_root_ca_pem.zip && \
    unzip russian_trusted_sub_ca_pem.zip && \
    rm linux_russian_trusted_root_ca_pem.zip russian_trusted_sub_ca_pem.zip && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates

# Build project
WORKDIR /usr/local/app
COPY . .
RUN npm install -D && \
    npm run build && \
    rm -R node_modules src package-lock.json tsconfig.json && \
    npm install

CMD ["npm", "start"]
